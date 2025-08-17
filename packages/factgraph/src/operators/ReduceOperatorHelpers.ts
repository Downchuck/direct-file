import { Result } from '../types/Result';
import { Thunk } from '../Thunk';
import { Explanation, opWithInclusiveChildren } from '../Explanation';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { ReduceOperator } from './ReduceOperator';

export function applyReduce<A>(
  op: ReduceOperator<A>,
  head: Result<A>,
  tail: Thunk<Result<A>>[]
): Result<A> {
  let acc = head;
  for (const thunk of tail) {
    const result = thunk.value;
    if (!acc.hasValue || !result.hasValue) {
      return Result.incomplete();
    }
    const value = op.reduce(acc.get, result.get);
    const complete = acc.isComplete && result.isComplete;
    if (complete) {
      acc = Result.complete(value);
    } else {
      acc = Result.placeholder(value);
    }
  }
  return acc;
}

export function explainReduce(
  xs: Expression<any>[],
  factual: Factual
): Explanation {
  const explanations = xs.map((expression) => expression.explain(factual));
  return opWithInclusiveChildren(explanations);
}
