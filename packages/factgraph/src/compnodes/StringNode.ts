import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory, WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { Factual } from '../Factual';

export class StringNode extends CompNode<string> {
  constructor(expression: Expression<string>) {
    super(expression);
  }

  public override set(factual: Factual, value: string): CompNode<string> {
    return new StringNode(Expression.literal(value));
  }
}

export const StringNodeFactory: DerivedNodeFactory & WritableNodeFactory = {
  typeName: 'String',

  fromWritableConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    return new StringNode(Expression.literal(''));
  },

  fromDerivedConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    const value = e.value ?? '';
    return new StringNode(Expression.literal(value));
  },
};
