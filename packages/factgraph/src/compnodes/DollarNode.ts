import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory, WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { Factual } from '../Factual';
import { Dollar } from '../types';

export class DollarNode extends CompNode<Dollar> {
  constructor(expression: Expression<Dollar>) {
    super(expression);
  }

  public override set(factual: Factual, value: Dollar): CompNode<Dollar> {
    return new DollarNode(Expression.literal(value));
  }
}

export const DollarNodeFactory: DerivedNodeFactory & WritableNodeFactory = {
  typeName: 'Dollar',
  fromWritableConfig: (e: any, graph: Graph) => new DollarNode(Expression.literal(Dollar.from(0))),
  fromDerivedConfig: (e: any, graph: Graph) => new DollarNode(Expression.literal(Dollar.from(e.value))),
};
