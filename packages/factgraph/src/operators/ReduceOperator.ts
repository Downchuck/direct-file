import { Result } from '../types/Result';
import { Thunk } from '../Thunk';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';
import { Factual } from '../Factual';

export interface ReduceOperator<A> {
  reduce(x: A, y: A): A;
  apply(head: Result<A>, tail: Thunk<Result<A>>[]): Result<A>;
  explain(xs: Expression<A>[], factual: Factual): Explanation;
}
