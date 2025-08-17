import { Result } from '../types/Result';
import { Thunk } from '../Thunk';
import { Explanation, opWithInclusiveChildren } from '../Explanation';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { BinaryOperator } from './BinaryOperator';

export function applyBinary<A, L, R>(
  op: BinaryOperator<A, L, R>,
  lhs: Result<L>,
  rhs: Result<R>
): Result<A> {
  if (!lhs.hasValue || !rhs.hasValue) {
    return Result.incomplete();
  }
  const value = op.operation(lhs.get, rhs.get);
  const complete = lhs.isComplete && rhs.isComplete;
  if (complete) {
    return Result.complete(value);
  }
  return Result.placeholder(value);
}

export function thunkBinary<A, L, R>(
  op: BinaryOperator<A, L, R>,
  lhs: Thunk<Result<L>>,
  rhs: Thunk<Result<R>>
): Thunk<Result<A>> {
  return lhs.flatMap((l) => rhs.map((r) => op.apply(l, r)));
}

export function explainBinary(
  lhs: Expression<any>,
  rhs: Expression<any>,
  factual: Factual
): Explanation {
  return opWithInclusiveChildren([
    lhs.explain(factual),
    rhs.explain(factual),
  ]);
}
