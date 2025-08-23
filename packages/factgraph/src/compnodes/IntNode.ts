import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory, WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { Factual } from '../Factual';

export class IntNode extends CompNode<number> {
  constructor(expression: Expression<number>) {
    super(expression);
  }

  public override set(factual: Factual, value: number): CompNode<number> {
    return new IntNode(Expression.literal(value));
  }
}

export const IntNodeFactory: DerivedNodeFactory & WritableNodeFactory = {
  typeName: 'Int',
  fromWritableConfig: (e: any, graph: Graph) => new IntNode(Expression.literal(0)),
  fromDerivedConfig: (e: any, graph: Graph) => new IntNode(Expression.literal(e.value ?? 0)),
};
