import { Result } from '../types/Result';
import { Explanation, opWithInclusiveChildren } from '../Explanation';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { ReduceOperator } from './ReduceOperator';

export function applyReduce<T>(
  op: ReduceOperator<T>,
  results: Result<T>[]
): Result<T> {
  if (results.some(r => !r.hasValue)) {
    return Result.incomplete();
  }

  const values = results.map(r => r.get);
  const finalValue = values.reduce(op.reduce, op.identity);

  const isComplete = results.every(r => r.isComplete);

  return isComplete ? Result.complete(finalValue) : Result.placeholder(finalValue);
}

export function explainReduce(
  expressions: Expression<any>[],
  factual: Factual
): Explanation {
  const explanations = expressions.map((expression) => expression.explain(factual));
  return opWithInclusiveChildren(explanations);
}
