import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory, WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { Rational } from '../types/Rational';
import { Result } from '../types/Result';

export class RationalNode extends CompNode {
  public readonly expr: Expression<Rational>;

  constructor(expr: Expression<Rational>) {
    super();
    this.expr = expr;
  }

  protected fromExpression(expr: Expression<Rational>): CompNode {
    return new RationalNode(expr);
  }
}

export const RationalNodeFactory: DerivedNodeFactory & WritableNodeFactory = {
  typeName: 'Rational',

  fromWritableConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    return new RationalNode(Expression.writable(Result.incomplete()));
  },

  fromDerivedConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    // TODO: getOptionValue
    const value = e.value || '0/1';
    return new RationalNode(
      Expression.literal(Result.complete(Rational.fromString(value)))
    );
  },
};
