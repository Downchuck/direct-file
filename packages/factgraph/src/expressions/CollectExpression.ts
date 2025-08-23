import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { MaybeVector, Result } from '../types';
import { Explanation } from '../Explanation';

export class CollectExpression<T> extends Expression<T[]> {
  constructor(private readonly dependency: Expression<T>) {
    super();
  }

  public override get(factual: Factual, ...children: Expression<any>[]): Result<T[]> {
    const vector = this.dependency.getVector(factual, ...children);
    const values = vector.map(result => result.value as T);
    return Result.fromVector(new MaybeVector(values.values, vector.isComplete));
  }

  public override explain(factual: Factual, ...children: Expression<any>[]): Explanation {
    // This is a simplification. A real implementation would be more detailed.
    return this.dependency.explain(factual, ...children);
  }
}
