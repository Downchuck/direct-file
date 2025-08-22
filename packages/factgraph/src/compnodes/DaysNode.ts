import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory, WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { Days } from '../types/Days';
import { Factual } from '../Factual';

export class DaysNode extends CompNode<Days> {
  constructor(expression: Expression<Days>) {
    super(expression);
  }

  public override set(factual: Factual, value: Days): CompNode<Days> {
    return new DaysNode(Expression.literal(value));
  }
}

export const DaysNodeFactory: DerivedNodeFactory & WritableNodeFactory = {
  typeName: 'Days',
  fromWritableConfig: (e: any, graph: Graph) => new DaysNode(Expression.literal(new Days(0))),
  fromDerivedConfig: (e: any, graph: Graph) => new DaysNode(Expression.literal(new Days(e.value))),
};
