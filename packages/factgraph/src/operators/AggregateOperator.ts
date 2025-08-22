import { Result } from '../types';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { Operator } from './Operator';
import { MaybeVector } from '../types/MaybeVector';

export interface AggregateOperator<A, B> extends Operator {
  apply(vect: MaybeVector<Result<A>>): Result<B>;
  explain(xs: Expression<A>, factual: Factual): Explanation;
}
