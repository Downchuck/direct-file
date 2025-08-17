import { CompNode, WritableNodeFactory } from "./CompNode";
import { Expression } from "../Expression";
import { MultiEnum } from "../types/MultiEnum";
import { Graph } from "../Graph";
import { Result } from "../types";

export class MultiEnumNode extends CompNode {
  constructor(public readonly expr: Expression<MultiEnum>) {
    super();
  }

  protected fromExpression(expr: Expression<MultiEnum>): CompNode {
    return new MultiEnumNode(expr);
  }
}

export class MultiEnumNodeFactory implements WritableNodeFactory {
  readonly typeName = "MultiEnum";

  fromWritableConfig(e: any, graph: Graph): CompNode {
    return new MultiEnumNode(Expression.writable(Result.incomplete()));
  }
}
