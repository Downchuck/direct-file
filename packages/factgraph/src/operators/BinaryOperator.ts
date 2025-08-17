import { Result } from '../types/Result';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { Explanation } from '../Explanation';

export interface BinaryOperator<A, L, R> {
  operation(lhs: L, rhs: R): A;
  apply(lhs: Result<L>, rhs: Result<R>): Result<A>;
  explain(
    lhs: Expression<L>,
    rhs: Expression<R>,
    factual: Factual
  ): Explanation;
}
