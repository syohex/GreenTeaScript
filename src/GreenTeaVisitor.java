// GreenTea Generator should be written in each language.

class TypedNode extends GtStatic {
	/*field*/public TypedNode	ParentNode		= null;
	/*field*/public TypedNode	PrevNode	    = null;
	/*field*/public TypedNode	NextNode		= null;

	/*field*/public GtType	Type;
	/*field*/public GtToken	Token;

	TypedNode/*constructor*/(GtType Type, GtToken Token) {
		this.Type = Type;
		this.Token = Token;
		this.ParentNode = null;
		this.PrevNode = null;
		this.NextNode = null;
	}

	public final void LinkNode(TypedNode Node) {
		Node.PrevNode = this;
		this.NextNode = Node;
	}

	public final TypedNode GetHeadNode() {
		TypedNode Node = this;
		while(Node.PrevNode != null) {
			Node = Node.PrevNode;
		}
		return Node;
	}

	public final TypedNode GetTailNode() {
		TypedNode Node = this;
		while(Node.NextNode != null) {
			Node = Node.NextNode;
		}
		return this;
	}

	public void Evaluate(GreenTeaGenerator Visitor) {
		// Override
	}

	public final boolean IsError() {
		return (this instanceof ErrorNode);
	}

}

class UnaryNode extends TypedNode {
	/*field*/public TypedNode	Expr;
	UnaryNode/*constructor*/(GtType Type, GtToken Token, TypedNode Expr) {
		super(Type, Token);
		this.Expr = Expr;
	}
}

class BinaryNode extends TypedNode {
	/*field*/public TypedNode    LeftNode;
	/*field*/public TypedNode	RightNode;
	BinaryNode/*constructor*/(GtType Type, GtToken Token, TypedNode Left, TypedNode Right) {
		super(Type, Token);
		this.LeftNode  = Left;
		this.RightNode = Right;
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitBinaryNode(this);
	}
}

class AndNode extends BinaryNode {
	AndNode/*constructor*/(GtType Type, GtToken Token, TypedNode Left, TypedNode Right) {
		super(Type, Token, Left, Right);
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitAndNode(this);
	}
}

class OrNode extends BinaryNode {
	OrNode/*constructor*/(GtType Type, GtToken Token, TypedNode Left, TypedNode Right) {
		super(Type, Token, Left, Right);
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitOrNode(this);
	}
}

class GetterNode extends TypedNode {
	/*field*/public TypedNode Expr;
	/*field*/public GtMethod  Method;
	GetterNode/*constructor*/(GtType Type, GtToken Token, TypedNode Expr, GtMethod Method) {
		super(Type, Token);
		this.Expr = Expr;
		this.Method = Method;
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitGetterNode(this);
	}
}

class AssignNode extends BinaryNode {
	AssignNode/*constructor*/(GtType Type, GtToken Token, TypedNode Left, TypedNode Right) {
		super(Type, Token, Left, Right);
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitAssignNode(this);
	}
}

class ConstNode extends TypedNode {
	/*field*/public Object	ConstValue;
	ConstNode/*constructor*/(GtType Type, GtToken Token, Object ConstValue) {
		super(Type, Token);
		this.ConstValue = ConstValue;
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitConstNode(this);
	}
}

class LocalNode extends TypedNode {
	LocalNode/*constructor*/(GtType Type, GtToken Token) {
		super(Type, Token);
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitLocalNode(this);
	}
}

class NullNode extends TypedNode {
	NullNode/*constructor*/(GtType Type, GtToken Token) {
		super(Type, Token);
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitNullNode(this);
	}
}

class LetNode extends TypedNode {
	public GtToken	    VarToken;
	public TypedNode	ValueNode;
	public TypedNode	BlockNode;

	/* let frame[Index] = Right in Block end */
	LetNode/*constructor*/(GtType Type, GtToken VarToken, TypedNode Right, TypedNode Block) {
		super(Type, VarToken);
		this.VarToken = VarToken;
		this.ValueNode = Right;
		this.BlockNode = Block;
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitLetNode(this);
	}
}

class ApplyNode extends TypedNode {
	public GtMethod	Method;
	public GtArray	Params; /* [this, arg1, arg2, ...] */

	/* call self.Method(arg1, arg2, ...) */
	ApplyNode/*constructor*/(GtType Type, GtToken KeyToken, GtMethod Method) {
		super(Type, KeyToken);
		this.Method = Method;
		this.Params = new GtArray();
	}
	
	ApplyNode/*constructor*/(GtType Type, GtToken KeyToken, GtMethod Method, TypedNode arg1) {
		super(Type, KeyToken);
		this.Method = Method;
		this.Params = new GtArray();
		this.Params.add(arg1);
	}
	
	public ApplyNode(GtType Type, GtToken KeyToken, GtMethod Method, TypedNode arg1, TypedNode arg2) {
		super(Type, KeyToken);
		this.Method = Method;
		this.Params = new GtArray();
		this.Params.add(arg1);
		this.Params.add(arg2);
	}

	public void Append(TypedNode Expr) {
		this.Params.add(Expr);
	}

	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitApplyNode(this);
	}
}

class NewNode extends TypedNode {
	public GtArray	Params; /* [this, arg1, arg2, ...] */

	NewNode/*constructor*/(GtType Type, GtToken Token) {
		super(Type, Token);
		this.Params = new GtArray();
	}

	public void Append(TypedNode Expr) {
		this.Params.add(Expr);
	}

	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitNewNode(this);
	}
}

class IfNode extends TypedNode {
	public TypedNode	CondExpr;
	public TypedNode	ThenNode;
	public TypedNode	ElseNode;

	/* If CondExpr then ThenBlock else ElseBlock */
	IfNode/*constructor*/(GtType Type, GtToken Token, TypedNode CondExpr, TypedNode ThenBlock, TypedNode ElseNode) {
		super(Type, Token);
		this.CondExpr = CondExpr;
		this.ThenNode = ThenBlock;
		this.ElseNode = ElseNode;
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitIfNode(this);
	}
}

class LoopNode extends TypedNode {
	public TypedNode	CondExpr;
	public TypedNode	LoopBody;
	public TypedNode	IterationExpr;

	public LoopNode(GtType Type, GtToken Token, TypedNode CondExpr, TypedNode LoopBody, TypedNode IterationExpr) {
		super(Type, Token);
		this.CondExpr = CondExpr;
		this.LoopBody = LoopBody;
		this.IterationExpr = IterationExpr;
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitLoopNode(this);
	}
}

class LabelNode extends TypedNode {
	/*field*/public String Label;
	LabelNode/*constructor*/(GtType Type, GtToken Token, String Label) {
		super(Type, Token);
		this.Label = Label;
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitLabelNode(this);
	}
}

class JumpNode extends TypedNode {
	/*field*/public String Label;
	JumpNode/*constructor*/(GtType Type, GtToken Token, String Label) {
		super(Type, Token);
		this.Label = Label;
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitJumpNode(this);
	}
}
class ContinueNode extends TypedNode {
	/*field*/public String Label;
	ContinueNode/*constructor*/(GtType Type, GtToken Token, String Label) {
		super(Type, Token);
		this.Label = Label;
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitContinueNode(this);
	}
}
class BreakNode extends TypedNode {
	/*field*/public String Label;
	BreakNode/*constructor*/(GtType Type, GtToken Token, String Label) {
		super(Type, Token);
		this.Label = Label;
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitBreakNode(this);
	}
}

class ReturnNode extends UnaryNode {
	ReturnNode/*constructor*/(GtType Type, GtToken Token, TypedNode Expr) {
		super(Type, Token, Expr);
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitReturnNode(this);
	}
}

class ThrowNode extends UnaryNode {
	ThrowNode/*constructor*/(GtType Type, GtToken Token, TypedNode Expr) {
		super(Type, Token, Expr);
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitThrowNode(this);
	}
}

class TryNode extends TypedNode {
	public TypedNode	TryBlock;
	public TypedNode	CatchBlock;
	public TypedNode	FinallyBlock;
	TryNode/*constructor*/(GtType Type, GtToken Token, TypedNode TryBlock, TypedNode FinallyBlock) {
		super(Type, Token);
		this.TryBlock = TryBlock;
		this.FinallyBlock = FinallyBlock;
		this.CatchBlock = null;
	}
//	public void addCatchBlock(TypedNode TargetException, TypedNode CatchBlock) { //FIXME
//		this.TargetException.add(TargetException);
//		this.CatchBlock.add(CatchBlock);
//	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitTryNode(this);
	}
}

class SwitchNode extends TypedNode {
	SwitchNode/*constructor*/(GtType Type, GtToken Token) {
		super(Type, Token);
	}
//	public TypedNode	CondExpr;
//	public GtArray	Labels;
//	public GtArray	Blocks;
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitSwitchNode(this);
	}
}

class DefineNode extends TypedNode {
	public GtDef	DefInfo;
	DefineNode/*constructor*/(GtType Type, GtToken Token, GtDef DefInfo) {
		super(Type, Token);
		this.DefInfo = DefInfo;
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitDefineNode(this);
	}
}

class FunctionNode extends TypedNode {
	FunctionNode/*constructor*/(GtType Type, GtToken Token) {
		super(Type, Token); // TODO
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitFunctionNode(this);
	}
}

class ErrorNode extends TypedNode {
	ErrorNode/*constructor*/(GtType Type, GtToken Token) {
		super(Type, Token);
	}
	@Override public void Evaluate(GreenTeaGenerator Visitor) {
		Visitor.VisitErrorNode(this);
	}
}

class GreenTeaGenerator extends GtStatic {
	
	public TypedNode CreateConstNode(GtType Type, GtToken Token, Object Value) { 
		return new ConstNode(Type, Token, Value); 
	}

	public TypedNode CreateNewNode(GtType Type, GtToken Token) { 
		return new NewNode(Type, Token); 
	}

	public TypedNode CreateNullNode(GtType Type, GtToken Token) { 
		return new NewNode(Type, Token); 
	}

	public TypedNode CreateLocalNode(GtType Type, GtToken Token) { 
		return new LocalNode(Type, Token);
	}

	public TypedNode CreateGetterNode(GtType Type, GtToken Token, TypedNode Expr) { 
		return new GetterNode(Type, Token, Expr, null);
	}

	public TypedNode CreateApplyNode(GtType Type, GtToken Token, TypedNode Func) { 
		return new ApplyNode(Type, Token, null, Func);
	}

	public TypedNode CreateAndNode(GtType Type, GtToken Token, TypedNode Left, TypedNode Right) { 
		return new AndNode(Type, Token, Left, Right);
	}

	public TypedNode CreateOrNode(GtType Type, GtToken Token, TypedNode Left, TypedNode Right) { 
		return new OrNode(Type, Token, Left, Right);
	}

	public TypedNode CreateAssignNode(GtType Type, GtToken Token, TypedNode Left, TypedNode Right) { 
		return new AssignNode(Type, Token, Left, Right);
	}

	public TypedNode CreateLetNode(GtType Type, GtToken Token, TypedNode Left, TypedNode Right, TypedNode Block) { 
		return new LetNode(Type, Token, Right, Block);
	}
	
	public TypedNode CreateIfNode(GtType Type, GtToken Token, TypedNode Cond, TypedNode Then, TypedNode Else) { 
		return new IfNode(Type, Token, Cond, Then, Else);
	}
	
	public TypedNode CreateSwitchNode(GtType Type, GtToken Token, TypedNode Match) { 
		return null; 
	}

	public TypedNode CreateLoopNode(GtType Type, GtToken Token, TypedNode Cond, TypedNode Block, TypedNode IterNode) { 
		return new LoopNode(Type, Token, Cond, Block, IterNode);
	}

	public TypedNode CreateReturnNode(GtType Type, GtToken Token, TypedNode Node) { 
		return new ReturnNode(Type, Token, Node);
	}

	public TypedNode CreateLabelNode(GtType Type, GtToken Token, TypedNode Node) { 
		return null; 
	}

	public TypedNode CreateJumpNode(GtType Type, GtToken Token, TypedNode Node, String Label) { 
		return new JumpNode(Type, Token, Label); 
	}

	public TypedNode CreateBreakNode(GtType Type, GtToken Token, TypedNode Node, String Label) { 
		return new BreakNode(Type, Token, Label); 
	}

	public TypedNode CreateContinueNode(GtType Type, GtToken Token, TypedNode Node, String Label) { 
		return new ContinueNode(Type, Token, Label); 
	}
	
	public TypedNode CreateTryNode(GtType Type, GtToken Token, TypedNode TryNode, TypedNode FinallyNode) { 
		return new TryNode(Type, Token, TryNode, FinallyNode); 
	}

	public TypedNode CreateThrowNode(GtType Type, GtToken Token, TypedNode Node) { 
		return new ThrowNode(Type, Token, Node); 
	}

	public TypedNode CreateFunctionNode(GtType Type, GtToken Token, TypedNode Block) { 
		return null; 
	}

	public TypedNode CreateDefineNode(GtType Type, GtToken Token, Object Module) { 
		return null; 
	}

	public TypedNode CreateErrorNode(GtType Type, GtToken Token) { 
		return new ErrorNode(Type, Token);
	}


	public void VisitDefineNode(DefineNode Node) { 
	}

	public void VisitConstNode(ConstNode Node) { 
	}

	public void VisitNewNode(NewNode Node) { 
	}

	public void VisitNullNode(NullNode Node) { 
	}

	public void VisitLocalNode(LocalNode Node) { 
	}

	public void VisitGetterNode(GetterNode Node) { 
	}

	public void VisitApplyNode(ApplyNode Node) { 
	}

	public void VisitBinaryNode(BinaryNode Node) { 
	}

	public void VisitAndNode(AndNode Node) { 
	}

	public void VisitOrNode(OrNode Node) { 
	}

	public void VisitAssignNode(AssignNode Node) { 
	}

	public void VisitLetNode(LetNode Node) { 
	}

	public void VisitIfNode(IfNode Node) { 
	}

	public void VisitSwitchNode(SwitchNode Node) { 
	}

	public void VisitLoopNode(LoopNode Node) { 
	}

	public void VisitReturnNode(ReturnNode Node) { 
	}

	public void VisitLabelNode(LabelNode Node) { 
	}

	public void VisitJumpNode(JumpNode Node) { 
	}

	public void VisitBreakNode(BreakNode Node) { 
	}
	
	public void VisitContinueNode(ContinueNode Node) { 
	}

	public void VisitTryNode(TryNode Node) { 
	}

	public void VisitThrowNode(ThrowNode Node) { 
	}

	public void VisitFunctionNode(FunctionNode Node) { 
	}

	public void VisitErrorNode(ErrorNode Node) { 
	}

	public void Evaluate(TypedNode Node) {
		TypedNode CurrentNode = Node;
		while(CurrentNode != null) {
			CurrentNode.Evaluate(this);
			CurrentNode = CurrentNode.NextNode;
		}
	}	
}

public class GreenTeaVisitor {
	
}
