import { Result } from '../types';
import { Explanation, opWithInclusiveChildren } from '../Explanation';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { Operator } from './Operator';

export interface UnaryOperator<A, X> extends Operator {
  operation(x: X): A;
  apply(x: Result<X>): Result<A>;
  explain(x: Expression<X>, factual: Factual): Explanation;
}

export function applyUnary<A, X>(
  op: UnaryOperator<A, X>,
  x: Result<X>
): Result<A> {
  if (!x.hasValue) {
    return Result.incomplete();
  }
  const value = op.operation(x.get);
  if (x.isComplete) {
    return Result.complete(value);
  }
  return Result.placeholder(value);
}

export function explainUnary<X>(
  x: Expression<X>,
  factual: Factual
): Explanation {
  return opWithInclusiveChildren([x.explain(factual)]);
}
