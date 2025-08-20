import { Expression } from '../Expression';
import { BinaryOperator, thunkBinary } from '../operators/BinaryOperator';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Explanation } from '../Explanation';

export class BinaryExpression<A, L, R> extends Expression<A> {
  constructor(
    public readonly lhs: Expression<L>,
    public readonly rhs: Expression<R>,
    public readonly op: BinaryOperator<A, L, R>
  ) {
    super();
  }

  override get(factual: Factual): Result<A> {
    const l = this.lhs.get(factual);
    const r = this.rhs.get(factual);
    return this.op.apply(l, r);
  }

  override explain(factual: Factual): Explanation {
    return this.op.explain(this.lhs, this.rhs, factual);
  }
}
