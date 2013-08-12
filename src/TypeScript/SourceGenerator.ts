/// <reference path="LangDeps.ts" />


/* language */

// Generator: GreenTeabe: shouldin: writtenlanguage: each. //

class GtNode {
	public ParentNode: GtNode;
	public PrevNode: GtNode;
	public NextNode: GtNode;

	public Type: GtType;
	public Token: GtToken;

	constructor(Type: GtType, Token: GtToken) {
		this.Type = Type;
		this.Token = Token;
		this.ParentNode = null;
		this.PrevNode = null;
		this.NextNode = null;
	}

	 MoveHeadNode(): GtNode {
		var Node: GtNode = this;
		while(Node.PrevNode != null) {
			Node = Node.PrevNode;
		}
		return Node;
	}

	 MoveTailNode(): GtNode {
		var Node: GtNode = this;
		while(Node.NextNode != null) {
			Node = Node.NextNode;
		}
		return Node;
	}

	public Append(Node: GtNode): void {
		/*extension*/
	}

	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitEmptyNode(this);  /*override: must */
	}

	 IsError(): boolean {
		return (this instanceof ErrorNode);
	}

	public toString(): string {
		return "(TypedNode)";
	}

	static Stringify(Block: GtNode): string {
		var Text: string = Block.toString();
		while(Block != null) {
			Text += Block.toString() + " ";
			Block = Block.NextNode;
		}
		return Text;
	}

	public CountForrowingNode(): number {
		var n: number = 0;
		var node: GtNode = this;
		while(node != null){
			n++;
			node = node.NextNode;
		}
		return n;
	}
}

//  E.g., "~" $Expr //
class UnaryNode extends GtNode {
	public Method: GtMethod;
	public Expr: GtNode;
	constructor(Type: GtType, Token: GtToken, Method: GtMethod, Expr: GtNode) {
		super(Type, Token);
		this.Method = Method;
		this.Expr = Expr;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitUnaryNode(this);
	}
}

//  E.g.,  $Expr "++" //
class SuffixNode extends GtNode {
	public Method: GtMethod;
	public Expr: GtNode;
	constructor(Type: GtType, Token: GtToken, Method: GtMethod, Expr: GtNode) {
		super(Type, Token);
		this.Method = Method;
		this.Expr = Expr;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitSuffixNode(this);
	}
}

//  E.g., $LeftNode "+" $RightNode //
class BinaryNode extends GtNode {
	public Method: GtMethod;
	public LeftNode: GtNode;
	public RightNode: GtNode;
	constructor(Type: GtType, Token: GtToken, Method: GtMethod, Left: GtNode, Right: GtNode) {
		super(Type, Token);
		this.Method = Method;
		this.LeftNode  = Left;
		this.RightNode = Right;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitBinaryNode(this);
	}
}

// E.g., $LeftNode && $RightNode //
class AndNode extends GtNode {
	public LeftNode: GtNode;
	public RightNode: GtNode;
	constructor(Type: GtType, Token: GtToken, Left: GtNode, Right: GtNode) {
		super(Type, Token);
		this.LeftNode  = Left;
		this.RightNode = Right;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitAndNode(this);
	}
	public toString(): string {
		return "(And:" + this.Type + " " + GtNode.Stringify(this.LeftNode) + ", " + GtNode.Stringify(this.RightNode) + ")";
	}
}

// E.g., $LeftNode || $RightNode //
class OrNode extends GtNode {
	public LeftNode: GtNode;
	public RightNode: GtNode;
	constructor(Type: GtType, Token: GtToken, Left: GtNode, Right: GtNode) {
		super(Type, Token);
		this.LeftNode  = Left;
		this.RightNode = Right;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitOrNode(this);
	}
	public toString(): string {
		return "(Or:" + this.Type + " " + GtNode.Stringify(this.LeftNode) + ", " + GtNode.Stringify(this.RightNode) + ")";
	}
}

// E.g., $LeftNode || $RightNode //
class GetterNode extends GtNode {
	public Expr: GtNode;
	public Method: GtMethod;
	constructor(Type: GtType, Token: GtToken, Method: GtMethod, Expr: GtNode) {
		super(Type, Token);
		this.Method = Method;
		this.Expr = Expr;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitGetterNode(this);
	}
	public toString(): string {
		return "(Getter:" + this.Type + " " + GtNode.Stringify(this.Expr) + ", " + this.Method.MethodName + ")";
	}
}

// E.g., $Expr "[" $Indexer "]" //
class IndexerNode extends GtNode {
	public Method: GtMethod;
	public Expr: GtNode;
	public Indexer: GtNode;
	constructor(Type: GtType, Token: GtToken, Method: GtMethod, Expr: GtNode, Indexer: GtNode) {
		super(Type, Token);
		this.Method = Method;
		this.Expr = Expr;
		this.Indexer = Indexer;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitIndexerNode(this);
	}
	public toString(): string {
		return "(Index:" + this.Type + " " + GtNode.Stringify(this.Expr) + ", " + GtNode.Stringify(this.Indexer) + ")";
	}
}

// E.g., $LeftNode = $RightNode //
class AssignNode extends GtNode {
	public LeftNode: GtNode;
	public RightNode: GtNode;
	constructor(Type: GtType, Token: GtToken, Left: GtNode, Right: GtNode) {
		super(Type, Token);
		this.LeftNode  = Left;
		this.RightNode = Right;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitAssignNode(this);
	}
	public toString(): string {
		return "(Assign:" + this.Type + " " + GtNode.Stringify(this.LeftNode) + " = " + GtNode.Stringify(this.RightNode) + ")";
	}
}

class ConstNode extends GtNode {
	public ConstValue: Object;
	constructor(Type: GtType, Token: GtToken, ConstValue: Object) {
		super(Type, Token);
		this.ConstValue = ConstValue;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitConstNode(this);
	}
	public toString(): string {
		return "(Const:" + this.Type + " "+ this.ConstValue.toString() + ")";
	}
}

class LocalNode extends GtNode {
	public LocalName: string;
	constructor(Type: GtType, Token: GtToken, LocalName: string) {
		super(Type, Token);
		this.LocalName = LocalName;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitLocalNode(this);
	}
	public toString(): string {
		return "(Local:" + this.Type + " " + this.LocalName + ")";
	}
}

class NullNode extends GtNode {
	constructor(Type: GtType, Token: GtToken) {
		super(Type, Token);
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitNullNode(this);
	}
	public toString(): string {
		return "(Null:" + this.Type + " " + ")";
	}
}

class LetNode extends GtNode {
	public DeclType: GtType;
	public VariableName: string;
	public InitNode: GtNode;
	public BlockNode: GtNode;
	/*VarNode: letBlock: end: in */
	constructor(Type: GtType, Token: GtToken, DeclType: GtType, VarName: string, InitNode: GtNode, Block: GtNode) {
		super(Type, Token);
		this.VariableName = VarName;
		this.DeclType = DeclType;
		this.InitNode  = InitNode;
		this.BlockNode = Block;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitLetNode(this);
	}
	public toString(): string {
		var Block: string = GtNode.Stringify(this.BlockNode);
		var Init: string  = "null";
		if(this.InitNode != null) {
			Init = GtNode.Stringify(this.InitNode);
		}
		return "(Let:" + this.Type + " " + this.VariableName + " = " +  Init  +" in {" + Block + "})";
	}
}

//  E.g., $Param[0] "(" $Param[1], $Param[2], ... ")" //
class ApplyNode extends GtNode {
	public Method: GtMethod;
	public Params: Array<GtNode>; /* [arg1, arg2, ...] */
	constructor(Type: GtType, KeyToken: GtToken, Method: GtMethod) {
		super(Type, KeyToken);
		this.Method = Method;
		this.Params = new Array<GtNode>();
	}
	public Append(Expr: GtNode): void {
		this.Params.add(Expr);
	}

	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitApplyNode(this);
	}
	public toString(): string {
		var Param: string = "";
		var i: number = 0;
		while(i < ListSize(this.Params)) {
			var Node: GtNode = this.Params.get(i);
			if(i != 0) {
				Param += ", ";
			}
			Param += GtNode.Stringify(Node);
			i = i + 1;
		}
		return "(Apply:" + this.Type + " " + Param + ")";
	}
}

// E.g., $Recv.Method "(" $Param[0], $Param[1], ... ")" //
class MessageNode extends GtNode {
	public Method: GtMethod;
	public RecvNode: GtNode;
	public Params: Array<GtNode>;
	constructor(Type: GtType, KeyToken: GtToken, Method: GtMethod, RecvNode: GtNode) {
		super(Type, KeyToken);
		this.Method = Method;
		this.RecvNode = RecvNode;
		this.Params = new Array<GtNode>();
	}
	public Append(Expr: GtNode): void {
		this.Params.add(Expr);
	}

	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitMessageNode(this);
	}
	public toString(): string {
		var Param: string = "";
		var i: number = 0;
		while(i < ListSize(this.Params)) {
			var Node: GtNode = this.Params.get(i);
			if(i != 0) {
				Param += ", ";
			}
			Param += GtNode.Stringify(Node);
			i = i + 1;
		}
		return "(Message:" + this.Type + " " + Param + ")";
	}
}

// E.g., "new" $Type "(" $Param[0], $Param[1], ... ")" //
class NewNode extends GtNode {
	public Params: Array<GtNode>;
	constructor(Type: GtType, Token: GtToken) {
		super(Type, Token);
		this.Params = new Array<GtNode>();
	}
	public Append(Expr: GtNode): void {
		this.Params.add(Expr);
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitNewNode(this);
	}
	public toString(): string {
		var Param: string = "";
		var i: number = 0;
		while(i < ListSize(this.Params)) {
			var Node: GtNode = this.Params.get(i);
			if(i != 0) {
				Param += ", ";
			}
			Param += GtNode.Stringify(Node);
			i = i + 1;
		}
		return "(New:" + this.Type + " " + Param + ")";
	}
}

// E.g., "if" "(" $Cond ")" $ThenNode "else" $ElseNode //
class IfNode extends GtNode {
	public CondExpr: GtNode;
	public ThenNode: GtNode;
	public ElseNode: GtNode;
	/*CondExpr: IfThenBlock: then else ElseBlock */
	constructor(Type: GtType, Token: GtToken, CondExpr: GtNode, ThenBlock: GtNode, ElseNode: GtNode) {
		super(Type, Token);
		this.CondExpr = CondExpr;
		this.ThenNode = ThenBlock;
		this.ElseNode = ElseNode;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitIfNode(this);
	}
	public toString(): string {
		var Cond: string = GtNode.Stringify(this.CondExpr);
		var Then: string = GtNode.Stringify(this.ThenNode);
		var Else: string = GtNode.Stringify(this.ElseNode);
		return "(If:" + this.Type + " Cond:" + Cond + " Then:"+ Then + " Else:" + Else + ")";
	}
}

// E.g., "while" "(" $CondExpr ")" $LoopBody //
class WhileNode extends GtNode {
	public CondExpr: GtNode;
	public LoopBody: GtNode;
	constructor(Type: GtType, Token: GtToken, CondExpr: GtNode, LoopBody: GtNode) {
		super(Type, Token);
		this.CondExpr = CondExpr;
		this.LoopBody = LoopBody;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitWhileNode(this);
	}
	public toString(): string {
		var Cond: string = GtNode.Stringify(this.CondExpr);
		var Body: string = GtNode.Stringify(this.LoopBody);
		return "(While:" + this.Type + " Cond:" + Cond + " Body:"+ Body + ")";
	}
}

class DoWhileNode extends GtNode {
	public CondExpr: GtNode;
	public LoopBody: GtNode;
	constructor(Type: GtType, Token: GtToken, CondExpr: GtNode, LoopBody: GtNode) {
		super(Type, Token);
		this.CondExpr = CondExpr;
		this.LoopBody = LoopBody;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitDoWhileNode(this);
	}
	public toString(): string {
		var Cond: string = GtNode.Stringify(this.CondExpr);
		var Body: string = GtNode.Stringify(this.LoopBody);
		return "(DoWhile:" + this.Type + " Cond:" + Cond + " Body:"+ Body + ")";
	}
}

// E.g., "for" "(" ";" $CondExpr ";" $IterExpr ")" $LoopNode //
class ForNode extends GtNode {
	public CondExpr: GtNode;
	public IterExpr: GtNode;
	public LoopBody: GtNode;
	constructor(Type: GtType, Token: GtToken, CondExpr: GtNode, IterExpr: GtNode, LoopBody: GtNode) {
		super(Type, Token);
		this.CondExpr = CondExpr;
		this.LoopBody = LoopBody;
		this.IterExpr = IterExpr;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitForNode(this);
	}
	public toString(): string {
		var Cond: string = GtNode.Stringify(this.CondExpr);
		var Body: string = GtNode.Stringify(this.LoopBody);
		var Iter: string = GtNode.Stringify(this.IterExpr);
		return "(For:" + this.Type + " Cond:" + Cond + " Body:"+ Body + " Iter:" + Iter + ")";
	}
}

// E.g., "for" "(" $Variable ":" $IterExpr ")" $LoopNode //
class ForEachNode extends GtNode {
	public Variable: GtNode;
	public IterExpr: GtNode;
	public LoopBody: GtNode;
	constructor(Type: GtType, Token: GtToken, Variable: GtNode, IterExpr: GtNode, LoopBody: GtNode) {
		super(Type, Token);
		this.Variable = Variable;
		this.IterExpr = IterExpr;
		this.LoopBody = LoopBody;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitForEachNode(this);
	}
	public toString(): string {
		var Var: string = GtNode.Stringify(this.Variable);
		var Body: string = GtNode.Stringify(this.LoopBody);
		var Iter: string = GtNode.Stringify(this.IterExpr);
		return "(Foreach:" + this.Type + " Var:" + Var + " Body:"+ Body + " Iter:" + Iter + ")";
	}
}

class LabelNode extends GtNode {
	public Label: string;
	constructor(Type: GtType, Token: GtToken, Label: string) {
		super(Type, Token);
		this.Label = Label;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitLabelNode(this);
	}
	public toString(): string {
		return "(Label:" + this.Type + " " + this.Label + ")";
	}
}

class JumpNode extends GtNode {
	public Label: string;
	constructor(Type: GtType, Token: GtToken, Label: string) {
		super(Type, Token);
		this.Label = Label;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitJumpNode(this);
	}
	public toString(): string {
		return "(Jump:" + this.Type + " " + this.Label + ")";
	}
}

class ContinueNode extends GtNode {
	public Label: string;
	constructor(Type: GtType, Token: GtToken, Label: string) {
		super(Type, Token);
		this.Label = Label;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitContinueNode(this);
	}
	public toString(): string {
		return "(Continue:" + this.Type + ")";
	}
}

class BreakNode extends GtNode {
	public Label: string;
	constructor(Type: GtType, Token: GtToken, Label: string) {
		super(Type, Token);
		this.Label = Label;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitBreakNode(this);
	}
	public toString(): string {
		return "(Break:" + this.Type + ")";
	}
}

class ReturnNode extends GtNode {
	public Expr: GtNode;
	constructor(Type: GtType, Token: GtToken, Expr: GtNode) {
		super(Type, Token);
		this.Expr = Expr;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitReturnNode(this);
	}
	public toString(): string {
		var Text: string = "";
		if(Text != null) {
			Text = GtNode.Stringify(this.Expr);
		}
		return "(Return:" + this.Type + " " + Text + ")";
	}
}

class ThrowNode extends GtNode {
	public Expr: GtNode;
	constructor(Type: GtType, Token: GtToken, Expr: GtNode) {
		super(Type, Token);
		this.Expr = Expr;
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitThrowNode(this);
	}
	public toString(): string {
		return "(Throw:" + this.Type + " " + GtNode.Stringify(this.Expr) + ")";
	}
}

class TryNode extends GtNode {
	TryBlock: GtNode;
	CatchBlock: GtNode;
	FinallyBlock: GtNode;
	constructor(Type: GtType, Token: GtToken, TryBlock: GtNode, FinallyBlock: GtNode) {
		super(Type, Token);
		this.TryBlock = TryBlock;
		this.FinallyBlock = FinallyBlock;
		this.CatchBlock = null;
	}
	// public addCatchBlock(TargetException: TypedNode, CatchBlock: TypedNode): void { //FIXME //
	// 	this.TargetException.add(TargetException); //
	// 	this.CatchBlock.add(CatchBlock); //
	// } //
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitTryNode(this);
	}
	public toString(): string {
		var TryBlock: string = GtNode.Stringify(this.TryBlock);
		return "(Try:" + this.Type + " " + TryBlock + ")";
	}
}

class SwitchNode extends GtNode {
	constructor(Type: GtType, Token: GtToken) {
		super(Type, Token);
	}
	// CondExpr: TypedNode; //
	// Labels: Array<TypedNode>; //
	// Blocks: Array<TypedNode>; //
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitSwitchNode(this);
	}
	public toString(): string {
		// FIXME //
		return "(Switch:" + this.Type + ")";
	}
}

class FunctionNode extends GtNode {
	constructor(Type: GtType, Token: GtToken) {
		super(Type, Token); //  TODO //
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitFunctionNode(this);
	}
	public toString(): string {
		return "(Function:" + this.Type + ")";
	}
}

class ErrorNode extends GtNode {
	constructor(Type: GtType, Token: GtToken) {
		super(Type, Token);
	}
	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitErrorNode(this);
	}
	public toString(): string {
		return "(Error:" + this.Type + " " + this.Token.toString() + ")";
	}
}

//  E.g., "ls" "-a".. //
class CommandNode extends GtNode {
	public Params: Array<GtNode>; /* ["ls", "-la", "/", ...] */
	public PipedNextNode: GtNode;
	constructor(Type: GtType, KeyToken: GtToken, PipedNextNode: GtNode) {
		super(Type, KeyToken);
		this.PipedNextNode = PipedNextNode;
		this.Params = new Array<GtNode>();
	}
	public Append(Expr: GtNode): void {
		this.Params.add(Expr);
	}

	public Evaluate(Visitor: GtGenerator): void {
		Visitor.VisitCommandNode(this);
	}
	public toString(): string {
		var Param: string = "";
		var i: number = 0;
		while(i < ListSize(this.Params)) {
			var Node: GtNode = this.Params.get(i);
			if(i != 0) {
				Param += ", ";
			}
			Param += GtNode.Stringify(Node);
			i = i + 1;
		}
		return "(Command:" + this.Type + " " + Param + ")";
	}
}

class GtObject {
	public Type: GtType;
	public Field: GtMap;
	constructor(Type: GtType) {
		this.Type = Type;
		this.Field = new GtMap();
	}
}

class GtType {
	 Context: GtContext;
	public PackageNameSpace: GtNameSpace;
	ClassFlag: number;
	ClassId: number;
	public ShortClassName: string;
	SuperClass: GtType;
	public SearchSuperMethodClass: GtType;
	public DefaultNullValue: Object;
	BaseClass: GtType;
	Types: GtType[];
	public LocalSpec: Object;

	constructor(Context: GtContext, ClassFlag: number, ClassName: string, DefaultNullValue: Object) {
		this.Context = Context;
		this.ClassFlag = ClassFlag;
		this.ShortClassName = ClassName;
		this.SuperClass = null;
		this.BaseClass = this;
		this.SearchSuperMethodClass = null;
		this.DefaultNullValue = DefaultNullValue;
		this.LocalSpec = null;
		this.ClassId = Context.ClassCount;
		Context.ClassCount += 1;
		this.Types = null;
	}

	 IsGenericType(): boolean {
		return (this.Types != null);
	}

	// Don: Note'tthis: directly: call.Context: Use.instead: GetGenericType. //
	public CreateGenericType(BaseIndex: number, TypeList: Array<GtType>, ShortName: string): GtType {
		var GenericType: GtType = new GtType(this.Context, this.ClassFlag, ShortName, null);
		GenericType.BaseClass = this.BaseClass;
		GenericType.SearchSuperMethodClass = this.BaseClass;
		GenericType.SuperClass = this.SuperClass;
		this.Types = LangDeps.CompactTypeList(BaseIndex, TypeList);
		console.log("DEBUG: " + "new class: " + GenericType.ShortClassName + ", ClassId=" + GenericType.ClassId);
		return GenericType;
	}

	public SetParamType(ParamType: GtType): void {
		this.Types = new Array<GtType>(1);
		this.Types[0] = ParamType;
	}

	public toString(): string {
		return this.ShortClassName;
	}

	 GetMethodId(MethodName: string): string {
		return "" + this.ClassId + "@" + MethodName;
	}

	 Accept(Type: GtType): boolean {
		if(this == Type || this == this.Context.AnyType) {
			return true;
		}
		return false;
	}
}

class GtMethod {
	public Layer: GtLayer;
	public MethodFlag: number;
	MethodSymbolId: number;
	public MethodName: string;
	public LocalFuncName: string;
	public Types: GtType[];
	private FuncType: GtType;
	public ElderMethod: GtMethod;
	public SourceMacro: string;

	constructor(MethodFlag: number, MethodName: string, BaseIndex: number, ParamList: Array<GtType>, SourceMacro: string) {
		this.MethodFlag = MethodFlag;
		this.MethodName = MethodName;
		this.MethodSymbolId = GetCanonicalSymbolId(MethodName);
		this.Types = LangDeps.CompactTypeList(BaseIndex, ParamList);
		LangDeps.Assert(this.Types.length > 0);
		this.Layer = null;
		this.ElderMethod = null;
		this.FuncType = null;
		this.SourceMacro = SourceMacro;
		
		var Name: string = this.MethodName;
		if(!LangDeps.IsLetter(LangDeps.CharAt(Name, 0))) {
			Name = "_operator" + this.MethodSymbolId;
		}
		if(!this.Is(ExportMethod)) {
			Name = Name + "__" + Mangle(this.GetRecvType(), BaseIndex + 1, ParamList);
		}
		this.LocalFuncName = Name;
	}

	public toString(): string {
		var s: string = this.MethodName + "(";
		var i: number = 0;
		while(i < this.GetParamSize()) {
			var ParamType: GtType = this.GetParamType(i);
			if(i > 0) {
				s += ", ";
			}
			s += ParamType.ShortClassName;
			i += 1;
		}
		return s + ": " + this.GetReturnType();
	}

	public Is(Flag: number): boolean {
		return IsFlag(this.MethodFlag, Flag);
	}

	 GetReturnType(): GtType {
		return this.Types[0];
	}

	 GetRecvType(): GtType {
		if(this.Types.length == 1){
			return this.Types[0].Context.VoidType;
		}
		return this.Types[1];
	}

	 GetParamSize(): number {
		return this.Types.length - 1;
	}

	 GetParamType(ParamIdx: number): GtType {
		return this.Types[ParamIdx+1];
	}

	 GetFuncType(): GtType {
		if(this.FuncType != null) {
			var Context: GtContext = this.GetRecvType().Context;
			this.FuncType = Context.GetGenericType(Context.FuncType, 0, this.Types, true);
		}
		return this.FuncType;
	}

	 ExpandMacro1(Arg0: string): string {
		if(this.SourceMacro == null) {
			return this.MethodName + " " + Arg0;
		}
		else {
			return this.SourceMacro.replaceAll("$0", Arg0);
		}
	}

	 ExpandMacro2(Arg0: string, Arg1: string): string {
		if(this.SourceMacro == null) {
			return Arg0 + " " + this.MethodName + " " + Arg1;
		}
		else {
			return this.SourceMacro.replaceAll("$0", Arg0).replaceAll("$1", Arg1);
		}
	}
}

class GtGenerator {
	public LangName: string;
	public Context: GtContext;
	public GeneratedCodeStack: Array<Object>;

	constructor(LangName: string) {
		this.LangName = LangName;
		this.Context = null;
		this.GeneratedCodeStack = new Array<Object>();
	}

	public SetLanguageContext(Context: GtContext): void {
		this.Context = Context;
	}

	 UnsupportedNode(Type: GtType, ParsedTree: GtSyntaxTree): GtNode {
		var Token: GtToken = ParsedTree.KeyToken;
		ParsedTree.NameSpace.ReportError(ErrorLevel, Token, this.LangName + "no: hassupport: for: language " + Token.ParsedText);
		return new ErrorNode(ParsedTree.NameSpace.Context.VoidType, ParsedTree.KeyToken);
	}

	public CreateConstNode(Type: GtType, ParsedTree: GtSyntaxTree, Value: Object): GtNode {
		return new ConstNode(Type, ParsedTree.KeyToken, Value);
	}

	public CreateNullNode(Type: GtType, ParsedTree: GtSyntaxTree): GtNode {
		return new NullNode(Type, ParsedTree.KeyToken);
	}

	public CreateLocalNode(Type: GtType, ParsedTree: GtSyntaxTree, LocalName: string): GtNode {
		return new LocalNode(Type, ParsedTree.KeyToken, LocalName);
	}

	public CreateGetterNode(Type: GtType, ParsedTree: GtSyntaxTree, Method: GtMethod, Expr: GtNode): GtNode {
		return new GetterNode(Type, ParsedTree.KeyToken, Method, Expr);
	}

	public CreateIndexerNode(Type: GtType, ParsedTree: GtSyntaxTree, Method: GtMethod, Expr: GtNode, Index: GtNode): GtNode {
		return new IndexerNode(Type, ParsedTree.KeyToken, Method, Expr, Index);
	}

	public CreateApplyNode(Type: GtType, ParsedTree: GtSyntaxTree, Method: GtMethod): GtNode {
		return new ApplyNode(Type, ParsedTree.KeyToken, Method);
	}

	public CreateMessageNode(Type: GtType, ParsedTree: GtSyntaxTree, RecvNode: GtNode, Method: GtMethod): GtNode {
		return new MessageNode(Type, ParsedTree.KeyToken, Method, RecvNode);
	}

	public CreateNewNode(Type: GtType, ParsedTree: GtSyntaxTree): GtNode {
		return new NewNode(Type, ParsedTree.KeyToken);
	}

	public CreateUnaryNode(Type: GtType, ParsedTree: GtSyntaxTree, Method: GtMethod, Expr: GtNode): GtNode {
		return new UnaryNode(Type, ParsedTree.KeyToken, Method, Expr);
	}

	public CreateSuffixNode(Type: GtType, ParsedTree: GtSyntaxTree, Method: GtMethod, Expr: GtNode): GtNode {
		return new SuffixNode(Type, ParsedTree.KeyToken, Method, Expr);
	}

	public CreateBinaryNode(Type: GtType, ParsedTree: GtSyntaxTree, Method: GtMethod, Left: GtNode, Right: GtNode): GtNode {
		return new BinaryNode(Type, ParsedTree.KeyToken, Method, Left, Right);
	}

	public CreateAndNode(Type: GtType, ParsedTree: GtSyntaxTree, Left: GtNode, Right: GtNode): GtNode {
		return new AndNode(Type, ParsedTree.KeyToken, Left, Right);
	}

	public CreateOrNode(Type: GtType, ParsedTree: GtSyntaxTree, Left: GtNode, Right: GtNode): GtNode {
		return new OrNode(Type, ParsedTree.KeyToken, Left, Right);
	}

	public CreateAssignNode(Type: GtType, ParsedTree: GtSyntaxTree, Left: GtNode, Right: GtNode): GtNode {
		return new AssignNode(Type, ParsedTree.KeyToken, Left, Right);
	}

	public CreateLetNode(Type: GtType, ParsedTree: GtSyntaxTree, DeclType: GtType, VarName: string, InitNode: GtNode, Block: GtNode): GtNode {
		return new LetNode(Type, ParsedTree.KeyToken, DeclType, VarName, InitNode, Block);
	}

	public CreateIfNode(Type: GtType, ParsedTree: GtSyntaxTree, Cond: GtNode, Then: GtNode, Else: GtNode): GtNode {
		return new IfNode(Type, ParsedTree.KeyToken, Cond, Then, Else);
	}

	public CreateSwitchNode(Type: GtType, ParsedTree: GtSyntaxTree, Match: GtNode): GtNode {
		return null;
	}

	public CreateWhileNode(Type: GtType, ParsedTree: GtSyntaxTree, Cond: GtNode, Block: GtNode): GtNode {
		return new WhileNode(Type, ParsedTree.KeyToken, Cond, Block);
	}

	public CreateDoWhileNode(Type: GtType, ParsedTree: GtSyntaxTree, Cond: GtNode, Block: GtNode): GtNode {
		return new DoWhileNode(Type, ParsedTree.KeyToken, Cond, Block);
	}

	public CreateForNode(Type: GtType, ParsedTree: GtSyntaxTree, Cond: GtNode, IterNode: GtNode, Block: GtNode): GtNode {
		return new ForNode(Type, ParsedTree.KeyToken, Cond, Block, IterNode);
	}

	public CreateForEachNode(Type: GtType, ParsedTree: GtSyntaxTree, VarNode: GtNode, IterNode: GtNode, Block: GtNode): GtNode {
		return new ForEachNode(Type, ParsedTree.KeyToken, VarNode, IterNode, Block);
	}

	public CreateReturnNode(Type: GtType, ParsedTree: GtSyntaxTree, Node: GtNode): GtNode {
		return new ReturnNode(Type, ParsedTree.KeyToken, Node);
	}

	public CreateLabelNode(Type: GtType, ParsedTree: GtSyntaxTree, Node: GtNode): GtNode {
		return null;
	}

	public CreateJumpNode(Type: GtType, ParsedTree: GtSyntaxTree, Node: GtNode, Label: string): GtNode {
		return new JumpNode(Type, ParsedTree.KeyToken, Label);
	}

	public CreateBreakNode(Type: GtType, ParsedTree: GtSyntaxTree, Node: GtNode, Label: string): GtNode {
		return new BreakNode(Type, ParsedTree.KeyToken, Label);
	}

	public CreateContinueNode(Type: GtType, ParsedTree: GtSyntaxTree, Node: GtNode, Label: string): GtNode {
		return new ContinueNode(Type, ParsedTree.KeyToken, Label);
	}

	public CreateTryNode(Type: GtType, ParsedTree: GtSyntaxTree, TryBlock: GtNode, FinallyBlock: GtNode): GtNode {
		return new TryNode(Type, ParsedTree.KeyToken, TryBlock, FinallyBlock);
	}

	public CreateThrowNode(Type: GtType, ParsedTree: GtSyntaxTree, Node: GtNode): GtNode {
		return new ThrowNode(Type, ParsedTree.KeyToken, Node);
	}

	public CreateFunctionNode(Type: GtType, ParsedTree: GtSyntaxTree, Block: GtNode): GtNode {
		return null;
	}

	public CreateDefineNode(Type: GtType, ParsedTree: GtSyntaxTree, Module: Object): GtNode {
		return null;
	}

	public CreateEmptyNode(Type: GtType, ParsedTree: GtSyntaxTree): GtNode {
		return new GtNode(ParsedTree.NameSpace.Context.VoidType, ParsedTree.KeyToken);
	}

	public CreateErrorNode(Type: GtType, ParsedTree: GtSyntaxTree): GtNode {
		return new ErrorNode(ParsedTree.NameSpace.Context.VoidType, ParsedTree.KeyToken);
	}

	public CreateCommandNode(Type: GtType, ParsedTree: GtSyntaxTree, PipedNextNode: GtNode): GtNode {
		return new CommandNode(Type, ParsedTree.KeyToken, PipedNextNode);
	}

	public ParseMethodFlag(MethodFlag: number, MethodDeclTree: GtSyntaxTree): number {
		if(MethodDeclTree.HasAnnotation("Export")) {
			MethodFlag = MethodFlag | ExportMethod;
		}
		if(MethodDeclTree.HasAnnotation("Operator")) {
			MethodFlag = MethodFlag | OperatorMethod;
		}
		return MethodFlag;
	}

	public CreateMethod(MethodFlag: number, MethodName: string, BaseIndex: number, TypeList: Array<GtType>, RawMacro: string): GtMethod {
		return new GtMethod(MethodFlag, MethodName, BaseIndex, TypeList, RawMacro);
	}

	public ParseClassFlag(ClassFlag: number, ClassDeclTree: GtSyntaxTree): number {
		if(ClassDeclTree.HasAnnotation("Final")) {
			ClassFlag = ClassFlag | FinalClass;
		}
		if(ClassDeclTree.HasAnnotation("Private")) {
			ClassFlag = ClassFlag | PrivateClass;
		}
		return ClassFlag;
	}
	// ------------------------------------------------------------------------ //

	public VisitEmptyNode(EmptyNode: GtNode): void {
		console.log("DEBUG: " + "node: empty: " + EmptyNode.Token.ParsedText);
	}

	public VisitSuffixNode(SuffixNode: SuffixNode): void {
		/*extension*/
	}

	public VisitUnaryNode(UnaryNode: UnaryNode): void {
		/*extension*/
	}

	public VisitIndexerNode(IndexerNode: IndexerNode): void {
		/*extension*/
	}

	public VisitMessageNode(MessageNode: MessageNode): void {
		/*extension*/
	}

	public VisitWhileNode(WhileNode: WhileNode): void {
		/*extension*/
	}

	public VisitDoWhileNode(DoWhileNode: DoWhileNode): void {
		/*extension*/
	}

	public VisitForNode(ForNode: ForNode): void {
		/*extension*/
	}

	public VisitForEachNode(ForEachNode: ForEachNode): void {
		/*extension*/
	}

	public VisitConstNode(Node: ConstNode): void {
		/*extension*/
	}

	public VisitNewNode(Node: NewNode): void {
		/*extension*/
	}

	public VisitNullNode(Node: NullNode): void {
		/*extension*/
	}

	public VisitLocalNode(Node: LocalNode): void {
		/*extension*/
	}

	public VisitGetterNode(Node: GetterNode): void {
		/*extension*/
	}

	public VisitApplyNode(Node: ApplyNode): void {
		/*extension*/
	}

	public VisitBinaryNode(Node: BinaryNode): void {
		/*extension*/
	}

	public VisitAndNode(Node: AndNode): void {
		/*extension*/
	}

	public VisitOrNode(Node: OrNode): void {
		/*extension*/
	}

	public VisitAssignNode(Node: AssignNode): void {
		/*extension*/
	}

	public VisitLetNode(Node: LetNode): void {
		/*extension*/
	}

	public VisitIfNode(Node: IfNode): void {
		/*extension*/
	}

	public VisitSwitchNode(Node: SwitchNode): void {
		/*extension*/
	}

	public VisitReturnNode(Node: ReturnNode): void {
		/*extension*/
	}

	public VisitLabelNode(Node: LabelNode): void {
		/*extension*/
	}

	public VisitJumpNode(Node: JumpNode): void {
		/*extension*/
	}

	public VisitBreakNode(Node: BreakNode): void {
		/*extension*/
	}

	public VisitContinueNode(Node: ContinueNode): void {
		/*extension*/
	}

	public VisitTryNode(Node: TryNode): void {
		/*extension*/
	}

	public VisitThrowNode(Node: ThrowNode): void {
		/*extension*/
	}

	public VisitFunctionNode(Node: FunctionNode): void {
		/*extension*/
	}

	public VisitErrorNode(Node: ErrorNode): void {
		/*extension*/
	}

	public VisitCommandNode(Node: CommandNode): void {
		/*extension*/
	}

	 VisitBlock(Node: GtNode): void {
		var CurrentNode: GtNode = Node;
		while(CurrentNode != null) {
			CurrentNode.Evaluate(this);
			CurrentNode = CurrentNode.NextNode;
		}
	}

	// must: Thisextended: beeach: language: in //
	public DefineFunction(Method: GtMethod, ParamNameList: Array<string>, Body: GtNode): void {
		/*extenstion*/
	}

	public Eval(Node: GtNode): Object {
		this.VisitBlock(Node);
		return null;
	}

	public AddClass(Type: GtType): void {
		/*extension*/
	}

	 PushCode(Code: Object): void{
		this.GeneratedCodeStack.add(Code);
	}

	 PopCode(): Object{
		var Size: number = this.GeneratedCodeStack.size();
		if(Size > 0){
			return this.GeneratedCodeStack.remove(Size - 1);
		}
		return "";
	}
}

class SourceGenerator extends GtGenerator {
	public IndentLevel: number;
	public CurrentLevelIndentString: string;

	constructor(LangName: string) {
		super(LangName);
		this.IndentLevel = 0;
		this.CurrentLevelIndentString = null;
	}

	/* GeneratorUtils */

	 Indent(): void {
		this.IndentLevel += 1;
		this.CurrentLevelIndentString = null;
	}

	 UnIndent(): void {
		this.IndentLevel -= 1;
		this.CurrentLevelIndentString = null;
		LangDeps.Assert(this.IndentLevel >= 0);
	}

	 GetIndentString(): string {
		if(this.CurrentLevelIndentString == null) {
			this.CurrentLevelIndentString = JoinStrings("   ", this.IndentLevel);
		}
		return this.CurrentLevelIndentString;
	}

	 StringfyConstValue(ConstValue: Object): string {
		if(ConstValue instanceof String) {
			return "\"" + ConstValue + "\"";  //  FIXME \n //
		}
		return ConstValue.toString();
	}

	 PushSourceCode(Code: string): void{
		this.GeneratedCodeStack.add(Code);
	}

	 PopSourceCode(): string{
		return <string>this.PopCode();
	}

	 PopManyCode(n: number): string[] {
		var array: string[] = new Array<string>(n);
		var i: number = 0;
		while(i < n) {
			array[i] = this.PopSourceCode();
			i = i + 1;
		}
		return array;
	}

	 PopManyCodeReverse(n: number): string[] {
		var array: string[] = new Array<string>(n);
		var i: number = 0;
		while(i < n) {
			array[n - i - 1] = this.PopSourceCode();
			i = i  + 1;
		}
		return array;
	}

	 PopManyCodeAndJoin(n: number, reverse: boolean, prefix: string, suffix: string, delim: string): string {
		if(prefix == null) {
			prefix = "";
		}
		if(suffix == null) {
			suffix = "";
		}
		if(delim == null) {
			delim = "";
		}
		var array: string[] = null;
		if(reverse) {
			array = this.PopManyCodeReverse(n);
		}else{
			array = this.PopManyCode(n);
		}
		var Code: string = "";
		var i: number = 0;
		while(i < n) {
			if(i > 0) {
				Code += delim;
			}
			Code = Code + prefix + array[i] + suffix;
			i = i + 1;
		}
		return Code;
	}

	 WriteTranslatedCode(Text: string): void {
		console.log(Text);
	}

}