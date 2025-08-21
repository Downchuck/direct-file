import { Result } from '../types/Result';
import { Explanation, opWithInclusiveChildren } from '../Explanation';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { UnaryOperator } from './UnaryOperator';

export function applyUnary<A, X>(
  op: UnaryOperator<A, X>,
  x: Result<X>
): Result<A> {
  if (!x.hasValue) {
    return Result.incomplete();
  }
  try {
    const value = op.operation(x.get);
    if (x.isComplete) {
      return Result.complete(value);
    }
    return Result.placeholder(value);
  } catch (e) {
    return Result.incomplete();
  }
}

export function explainUnary<X>(
  x: Expression<X>,
  factual: Factual
): Explanation {
  return opWithInclusiveChildren([x.explain(factual)]);
}
