import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory, WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { Factual } from '../Factual';

export class BooleanNode extends CompNode<boolean> {
  constructor(expression: Expression<boolean>) {
    super(expression);
  }

  public override set(factual: Factual, value: boolean): CompNode<boolean> {
    return new BooleanNode(Expression.literal(value));
  }
}

export const BooleanNodeFactory: DerivedNodeFactory & WritableNodeFactory = {
  typeName: 'Boolean',
  fromWritableConfig: (e: any, graph: Graph) => new BooleanNode(Expression.literal(false)),
  fromDerivedConfig: (e: any, graph: Graph) => new BooleanNode(Expression.literal(e.value ?? false)),
};
