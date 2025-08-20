import { Expression } from '../Expression';
import { Graph } from '../Graph';
import { Ein } from '../types/Ein';
import { CompNode, CompNodeFactory } from './CompNode';
import { Result } from '../types';

export class EinNode extends CompNode {
  constructor(readonly expr: Expression<Ein>) {
    super();
  }

  protected fromExpression(expr: Expression<Ein>): EinNode {
    return new EinNode(expr);
  }

  get valueClass() {
      return Ein;
  }
}

export class EinNodeFactory implements CompNodeFactory {
  readonly typeName = 'EIN';
  fromDerivedConfig(
    e: { options: { value: string } },
    graph: Graph
  ): EinNode {
    return new EinNode(Expression.literal(Result.complete(Ein.fromString(e.options.value))));
  }
};
