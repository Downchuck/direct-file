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

import { compNodeRegistry } from "./registry";

export class MultiEnumNodeFactory implements WritableNodeFactory {
  readonly typeName = "MultiEnum";

  fromWritableConfig(e: any, graph: Graph): CompNode {
    return new MultiEnumNode(Expression.writable(Result.incomplete()));
  }

  fromDerivedConfig(e: any, graph: Graph): CompNode {
    const options = e.options as string[];
    const children = e.children.map((child: any) => compNodeRegistry.fromDerivedConfig(child, graph));
    const values = children.map(c => c.get(graph).get);
    const allValid = values.every(v => options.includes(v));

    if (allValid) {
      return new MultiEnumNode(Expression.literal(Result.complete(values)));
    } else {
      return new MultiEnumNode(Expression.literal(Result.incomplete()));
    }
  }
}
