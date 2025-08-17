import { Result } from '../types/Result';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';
import { Factual } from '../Factual';

export interface UnaryOperator<A, X> {
  operation(x: X): A;
  apply(x: Result<X>): Result<A>;
  explain(x: Expression<X>, factual: Factual): Explanation;
}
