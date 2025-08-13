import { Explanation } from '../Explanation';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { Result } from '../types/Result';
import { Operator } from './Operator';

export interface UnaryOperator<T, V> extends Operator {
  apply(a: Result<T>): Result<V>;
  explain(a: Expression<T>, factual: Factual): Explanation;
}
