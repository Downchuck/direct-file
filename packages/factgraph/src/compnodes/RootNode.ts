import { CompNode, CompNodeFactory } from './CompNode';
import { Expression } from '../Expression';
import { Graph } from '../Graph';
import { Result } from '../types';

import { PathItem } from '../PathItem';
import { Factual } from '../Factual';

export class RootNode extends CompNode {
  constructor() {
    super();
    this.expr = Expression.literal(Result.complete(null));
  }

  protected fromExpression(expr: Expression<any>): CompNode {
    return new RootNode();
  }

  override extract(key: PathItem, factual: Factual): CompNode | undefined {
    const fact = factual.getFact(key.toString());
    return fact?.value;
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
