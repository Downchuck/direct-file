import { Expression } from '../Expression';
import { BinaryOperator } from '../operators/BinaryOperator';
import { MaybeVector, Result } from '../types';

export class BinaryExpression<A, L, R> extends Expression<A> {
  constructor(
    public readonly lhs: Expression<L>,
    public readonly rhs: Expression<R>,
    public readonly op: BinaryOperator<A, L, R>
  ) {
    super();
  }

  override get(): MaybeVector<Result<A>> {
    // This logic needs to be translated from the Scala `get` method
    // op(lhs.get, rhs.getThunk)
    return this.op.operation(this.lhs.get(), this.rhs.getThunk());
  }

  override getThunk(): MaybeVector<Result<A>> {
    throw new Error('Not implemented');
  }

  override explain(): MaybeVector<any> {
    throw new Error('Not implemented');
  }
}
