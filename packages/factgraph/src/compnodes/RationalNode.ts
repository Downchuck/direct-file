import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory, WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { Factual } from '../Factual';
import { Rational } from '../types';

export class RationalNode extends CompNode<Rational> {
  constructor(expression: Expression<Rational>) {
    super(expression);
  }

  public override set(factual: Factual, value: Rational): CompNode<Rational> {
    return new RationalNode(Expression.literal(value));
  }
}

export const RationalNodeFactory: DerivedNodeFactory & WritableNodeFactory = {
  typeName: 'Rational',
  fromWritableConfig: (e: any, graph: Graph) => new RationalNode(Expression.literal(Rational.from(0))),
  fromDerivedConfig: (e: any, graph: Graph) => new RationalNode(Expression.literal(new Rational(e.value.p, e.value.q))),
};
