import { Expression } from '../Expression';
import { UnaryOperator } from '../operators/UnaryOperator';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Explanation } from '../Explanation';

export class UnaryExpression<A, B> extends Expression<A> {
  constructor(
    public readonly expression: Expression<B>,
    public readonly op: UnaryOperator<A, B>
  ) {
    super();
  }

  override get(factual: Factual): Result<A> {
    const result = this.expression.get(factual);
    return this.op.apply(result);
  }

  override explain(factual: Factual): Explanation {
    return this.op.explain(this.expression, factual);
  }
}
