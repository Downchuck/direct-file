import { Expression } from '../Expression';
import { ReduceOperator } from '../operators/ReduceOperator';
import { MaybeVector, Result } from '../types';

export class ReduceExpression<A> extends Expression<A> {
  constructor(
    public readonly expressions: Expression<A>[],
    public readonly op: ReduceOperator<A>
  ) {
    super();
  }

  override get(): MaybeVector<Result<A>> {
    // This logic needs to be translated from the Scala `get` method
    // op(xs.head.get, xs.tail.map(_.getThunk))
    throw new Error('Not implemented');
  }

  override getThunk(): MaybeVector<Result<A>> {
    throw new Error('Not implemented');
  }

  override explain(): MaybeVector<any> {
    throw new Error('Not implemented');
  }
}
