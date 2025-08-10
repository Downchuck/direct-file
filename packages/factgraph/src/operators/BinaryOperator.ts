import { MaybeVector, Result } from '../types';
import { Thunk } from '../Thunk';
import { Explanation, opWithInclusiveChildren } from '../Explanation';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { Operator } from './Operator';

export interface BinaryOperator<A, L, R> extends Operator {
  operation(lhs: L, rhs: R): A;
}

export function applyBinary<A, L, R>(
  op: BinaryOperator<A, L, R>,
  lhs: Result<L>,
  rhs: Thunk<Result<R>>
): Result<A> {
  const rhsResult = rhs.get;
  if (!lhs.hasValue || !rhsResult.hasValue) {
    return Result.incomplete();
  }
  const value = op.operation(lhs.get, rhsResult.get);
  const complete = lhs.isComplete && rhsResult.isComplete;
  return new Result(value, complete);
}

export function applyBinaryVector<A, L, R>(
  op: BinaryOperator<A, L, R>,
  lhs: MaybeVector<Result<L>>,
  rhs: MaybeVector<Thunk<Result<R>>>
): MaybeVector<Result<A>> {
  return MaybeVector.vectorize2((l, r) => applyBinary(op, l, r), lhs, rhs);
}

export function thunkBinary<A, L, R>(
  op: BinaryOperator<A, L, R>,
  lhs: Thunk<Result<L>>,
  rhs: Thunk<Result<R>>
): Thunk<Result<A>> {
  return lhs.map((result) => applyBinary(op, result, rhs));
}

export function thunkBinaryVector<A, L, R>(
  op: BinaryOperator<A, L, R>,
  lhs: MaybeVector<Thunk<Result<L>>>,
  rhs: MaybeVector<Thunk<Result<R>>>
): MaybeVector<Thunk<Result<A>>> {
  return MaybeVector.vectorize2((l, r) => thunkBinary(op, l, r), lhs, rhs);
}

export function explainBinary(
  lhs: Expression<any>,
  rhs: Expression<any>,
  factual: Factual
): MaybeVector<Explanation> {
  return MaybeVector.vectorize2(
    (lhsExplanation: Explanation, rhsExplanation: Explanation) =>
      opWithInclusiveChildren([lhsExplanation, rhsExplanation]),
    lhs.explain(factual),
    rhs.explain(factual)
  );
}
