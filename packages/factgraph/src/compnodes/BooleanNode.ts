import { Expression } from '../Expression';
import { CompNode, CompNodeFactory } from './CompNode';
import { Result } from '../types';
import { WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';

export class BooleanNode extends CompNode {
  constructor(public readonly expr: Expression<boolean>) {
    super();
  }

  protected fromExpression(expr: Expression<boolean>): CompNode {
    return new BooleanNode(expr);
  }
}

export const BooleanNodeFactory: CompNodeFactory & WritableNodeFactory = {
  typeName: 'Boolean',

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    return new BooleanNode(Expression.literal(Result.complete(e.value)));
  },

  fromWritableConfig(): CompNode {
    return new BooleanNode(Expression.writable(Result.incomplete()));
  },
};
