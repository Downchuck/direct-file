import { CompNode, CompNodeFactory } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { Expression } from '../Expression';
import { Result } from '../types';
import { Graph } from '../Graph';

export const FalseFactory: CompNodeFactory = {
  typeName: 'False',

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    return this.create();
  },

  create(): CompNode {
    return new BooleanNode(Expression.literal(Result.complete(false)));
  },
};
