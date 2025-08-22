import { Result } from '../types/Result';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';
import { Factual } from '../Factual';

export interface ReduceOperator<T> {
  identity: T;
  reduce(a: T, b: T): T;
  apply(results: Result<T>[]): Result<T>;
  explain(expressions: Expression<T>[], factual: Factual): Explanation;
}
