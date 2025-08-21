import { CompNode, CompNodeFactory } from './CompNode';
import { Expression } from '../Expression';
import { Graph } from '../Graph';
import { Result } from '../types';

export class RootNode extends CompNode {
  constructor() {
    super();
    this.expr = Expression.literal(Result.complete(null));
  }

  protected fromExpression(expr: Expression<any>): CompNode {
    return new RootNode();
  }
}

export const RootNodeFactory: CompNodeFactory = {
  typeName: 'Root',

  fromDerivedConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    return new RootNode();
  },
};
