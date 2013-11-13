// ***************************************************************************
// Copyright (c) 2013, JST/CREST DEOS project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// *  Redistributions of source code must retain the above copyright notice,
//    this list of conditions and the following disclaimer.
// *  Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
// TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
// PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
// EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
// OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
// OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
// **************************************************************************

//ifdef JAVA
package org.GreenTeaScript;
import java.util.ArrayList;
//endif VAJA

public class EmacsLispSourceGenerator extends SourceGenerator {

	EmacsLispSourceGenerator(String TargetCode, String OutputFile, int GeneratorFlag) {
		super(TargetCode, OutputFile, GeneratorFlag);
		this.Tab = "    ";
		this.TrueLiteral  = "t";
		this.FalseLiteral = "nil";
		this.NullLiteral = "nil";
		this.LineComment = ";;";
//		this.SwitchCaseCount = 0;
		this.BlockBegin = "";
		this.BlockEnd = "";
		this.SemiColon = "";
	}

	@Override public void VisitWhileNode(GtWhileNode Node) {
		String Program = "(while " + this.VisitNode(Node.CondExpr) + this.LineFeed;
		Program += this.VisitBlockWithIndent(Node.LoopBody, true);
		Program += ")";
		this.PushSourceCode(Program);
	}

	@Override public void VisitDoWhileNode(GtDoWhileNode Node) {
		String Program = "(loop initially ";
		String LoopBody = this.VisitBlockWithIndent(Node.LoopBody, false);
		String CondExpr = this.VisitNode(Node.CondExpr);

		Program += "(progn " + LoopBody + ")" + this.LineFeed;
		Program += this.GetIndentString() + "     ";
		Program += "while " + CondExpr + this.LineFeed;
		Program += this.GetIndentString() + "     ";
		Program += "do (progn " + LoopBody + ")";
		Program += ")" + this.LineFeed;
		this.PushSourceCode(Program);
	}

	@Override public void VisitForNode(GtForNode Node) {
		String LoopBody = this.VisitBlockWithIndent(Node.LoopBody, true);
		String IterExpr = this.VisitNode(Node.IterExpr);
		String Program = "(loop while " + this.VisitNode(Node.CondExpr) + this.LineFeed;

		Program += "do (progn" + LoopBody;
		Program += this.LineFeed + IterExpr + ")";

		Program += ")";
		this.PushSourceCode(Program);
	}

	@Override public void VisitForEachNode(GtForEachNode Node) {
		String Iter = this.VisitNode(Node.IterExpr);
		String Variable = this.VisitNode(Node.Variable);
		String Program = "(loop for " + Variable + " in " + Iter + this.LineFeed;

		Program += this.VisitBlockWithIndent(Node.LoopBody, true);
		Program += ")";
		this.PushSourceCode(Program);
	}

	@Override public void VisitVarNode(GtVarNode Node) {
		String VarName = Node.NativeName;
		String Code = "(setq " + VarName + " ";

		if (Node.InitNode != null) {
			Code += this.VisitNode(Node.InitNode);
		} else {
			Code += "nil";
		}

		Code += ")" + this.LineFeed;
		this.PushSourceCode(Code + this.VisitBlockWithIndent(Node.BlockNode, false));
	}

//	@Override public void VisitTryNode() {
//		// XXX
//	}

	@Override public void VisitTrinaryNode(GtTrinaryNode Node) {
		String CondExpr = this.VisitNode(Node.ConditionNode);
		String Then = this.VisitNode(Node.ThenNode);
		String Else = this.VisitNode(Node.ElseNode);

		this.PushSourceCode("(if " + CondExpr + " " + Then + " " + Else + ")");
	}

	@Override public void VisitIfNode(GtIfNode Node) {
		String CondExpr = this.VisitNode(Node.CondExpr);
		String ThenBlock = this.VisitBlockWithIndent(Node.ThenNode, true);
		String Code = "(if " + CondExpr + " " + ThenBlock;

		if (!this.IsEmptyBlock(Node.ElseNode)) {
			String ElseBlock = this.VisitBlockWithIndent(Node.ElseNode, true);
			Code += " " + ElseBlock;
		}
		Code += ")";
		this.PushSourceCode(Code);
	}

//	@Override public void VisitSwitchNode(SwitchNode Node) {
//	}

	@Override public void VisitErrorNode(GtErrorNode Node) {
		String Code = "(error \"" + Node.Token.ParsedText + "\")";
		this.PushSourceCode(Code);
	}

	private String AppendCommand(GtCommandNode CurrentNode) {
		String Code = "";

		for (GtNode Param : CurrentNode.ArgumentList) {
			Code += Param + " ";
		}

		return Code;
	}

	@Override public void VisitCommandNode(GtCommandNode Node) {
		String Code = "";
		GtCommandNode CurrentNode = Node;

		while (CurrentNode != null) {
			Code += this.AppendCommand(CurrentNode);
			CurrentNode = (GtCommandNode)CurrentNode.PipedNextNode;
		}

		if (Node.Type.IsStringType()) {
			Code = "(shell-command-to-string \"" + Code +"\")";
		} else if (Node.Type.IsBooleanType()) {
			Code = "(zerop (call-process-shell-command \"" + Code + "\"))";
		} else {
			Code = "(call-process-shell-command \"" + Code + "\")";
		}
		this.PushSourceCode(Code);
	}

	@Override public void GenerateFunc(GtFunc Func, ArrayList<String> ParamNameList, GtNode Body) {
		this.FlushErrorReport();

		String Function = "(defun ";
		Function += Func.GetNativeFuncName() + " (";

		int i = 0;
		for (String Param : ParamNameList) {
			Function += Param + " ";
		}
		Function += ")" + this.LineFeed;

		Function += this.VisitBlockWithIndent(Body, true);

		Function += ")"; // end of defun
		this.WriteLineCode(Function);
	}

	@Override public void OpenClassField(GtSyntaxTree ParsedTree, GtType Type, GtClassField ClassField) {
		this.FlushErrorReport();
		String Program = this.GetIndentString();

		Program += "(defclass " + Type.ShortName + " " + "()";
		Program += this.LineFeed;
		Program += "(";

		for (GtFieldInfo FieldInfo : ClassField.FieldList) {
			String InitValue = this.StringifyConstValue(FieldInfo.InitValue);

			Program += "(" + FieldInfo.NativeName;
			Program += " :initarg :" + FieldInfo.NativeName;

			if (!FieldInfo.Type.IsNativeType()) {
				InitValue = "nil";
			}
			Program += " :initform " + InitValue;
			Program += ")";
		}

		Program += "))";
		this.WriteLineCode(Program);
	}

//	@Override public Object Eval(GtNode Node) {
//		// XXX
//	}

	@Override public void StartCompilationUnit() {
		this.WriteLineCode("(require 'cl)");
		this.WriteLineCode("(require 'eieio)");
	}

	@Override public void InvokeMainFunc(String MainFuncName) {
		this.WriteLineCode("(" + MainFuncName + ")");
	}

	@Override public void VisitReturnNode(GtReturnNode Node) {
		/*local*/String Code = "";
		if(Node.Expr != null) {
			Code += " " + this.VisitNode(Node.Expr);
		}
		this.PushSourceCode(Code);
		this.StopVisitor(Node);
	}

	@Override public void VisitUnaryNode(GtUnaryNode Node) {
		/*local*/String FuncName = Node.Token.ParsedText;
		/*local*/String Expr = this.VisitNode(Node.Expr);
		this.PushSourceCode(SourceGenerator.GenerateApplyFunc1(Node.Func, FuncName, false, Expr));
	}

	@Override public void VisitBinaryNode(GtBinaryNode Node) {
		/*local*/String FuncName = Node.Token.ParsedText;
		/*local*/String Left = this.VisitNode(Node.LeftNode);
		/*local*/String Right = this.VisitNode(Node.RightNode);
		this.PushSourceCode(SourceGenerator.GenerateApplyFunc2(Node.Func, FuncName, Left, Right));
	}

	@Override public void VisitSelfAssignNode(GtSelfAssignNode Node) {
		/*local*/String FuncName = Node.Token.ParsedText;
		/*local*/String Left = this.VisitNode(Node.LeftNode);
		/*local*/String Right = this.VisitNode(Node.RightNode);
		this.PushSourceCode("(setq " + Left + " "
				    + SourceGenerator.GenerateApplyFunc2(Node.Func, FuncName, Left, Right)
				    + ")");
	}

	@Override public String VisitBlockWithIndent(GtNode Node, boolean NeedBlock) {
		/*local*/String Code = "";
		/*local*/GtNode CurrentNode = Node;

		if (NeedBlock) {
			this.Indent();
		}

		while (CurrentNode != null) {
			if(!this.IsEmptyBlock(CurrentNode)) {
				/*local*/String Stmt = this.VisitNode(CurrentNode);
				if(!LibGreenTea.EqualsString(Stmt, "")) {
					Code += Stmt;
				}
			}
			CurrentNode = CurrentNode.NextNode;
		}

		if(NeedBlock) {
			this.UnIndent();
		}

		return Code;
	}

//	@Override public String GetRecvName() {
//		// XXXp
//	}
}

// Local Variables:
// mode: java
// c-basic-offset: 8
// indent-tabs-mode: t
// End:
