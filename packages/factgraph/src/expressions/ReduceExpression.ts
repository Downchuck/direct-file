import { Expression } from '../Expression';
import { ReduceOperator } from '../operators/ReduceOperator';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Explanation } from '../Explanation';

export class ReduceExpression<T> extends Expression<T> {
  constructor(public readonly op: ReduceOperator<T>) {
    super();
  }

  override get(factual: Factual, ...children: Expression<any>[]): Result<T> {
    if (children.length === 0) {
      return Result.complete(this.op.identity);
    }
    const results = children.map(c => c.get(factual));
    return this.op.apply(results);
  }

  override explain(factual: Factual, ...children: Expression<any>[]): Explanation {
    return this.op.explain(children, factual);
  }
}
