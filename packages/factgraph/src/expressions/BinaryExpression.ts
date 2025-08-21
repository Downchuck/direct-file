import { Expression } from '../Expression';
import { BinaryOperator } from '../operators/BinaryOperator';
import { thunkBinary } from '../operators/BinaryOperatorHelpers';
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
    const thunk = thunkBinary(
      this.op,
      this.lhs.getThunk(factual),
      this.rhs.getThunk(factual)
    );
    return thunk.value;
  }

  override explain(factual: Factual): Explanation {
    return this.op.explain(this.lhs, this.rhs, factual);
  }
}
