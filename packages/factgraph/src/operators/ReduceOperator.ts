import { MaybeVector, Result } from '../types';
import { Thunk } from '../Thunk';
import { Explanation, opWithInclusiveChildren } from '../Explanation';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { Operator } from './Operator';

export interface ReduceOperator<A> extends Operator {
  reduce(x: A, y: A): A;
}

export function applyReduce<A>(
  op: ReduceOperator<A>,
  head: Result<A>,
  tail: Thunk<Result<A>>[]
): Result<A> {
  if (!head.hasValue) {
    return Result.incomplete();
  }

  const lazyTail = tail.map((t) => t.get);
  if (lazyTail.some((r) => !r.hasValue)) {
    return Result.incomplete();
  }

  const values = [head, ...lazyTail].map((r) => r.get);
  const value = values.reduce(op.reduce);
  const complete = [head, ...lazyTail].every((r) => r.isComplete);

  return new Result(value, complete);
}

export function applyReduceVector<A>(
  op: ReduceOperator<A>,
  head: MaybeVector<Result<A>>,
  tail: MaybeVector<Thunk<Result<A>>>[]
): MaybeVector<Result<A>> {
  return MaybeVector.vectorizeList(
    (h, t) => applyReduce(op, h, t),
    head,
    tail
  );
}

export function thunkReduce<A>(
  op: ReduceOperator<A>,
  head: Thunk<Result<A>>,
  tail: Thunk<Result<A>>[]
): Thunk<Result<A>> {
  return head.map((result) => applyReduce(op, result, tail));
}

export function thunkReduceVector<A>(
  op: ReduceOperator<A>,
  head: MaybeVector<Thunk<Result<A>>>,
  tail: MaybeVector<Thunk<Result<A>>>[]
): MaybeVector<Thunk<Result<A>>> {
  return MaybeVector.vectorizeList(
    (h, t) => thunkReduce(op, h, t),
    head,
    tail
  );
}

export function explainReduce(
  xs: Expression<any>[],
  factual: Factual
): MaybeVector<Explanation> {
  const explanations = xs.map((expression) => expression.explain(factual));
  return MaybeVector.vectorizeList(
    (head: Explanation, tail: Explanation[]) =>
      opWithInclusiveChildren([head, ...tail]),
    explanations[0],
    explanations.slice(1)
  );
}
