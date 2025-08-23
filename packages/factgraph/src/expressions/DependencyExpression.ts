import { Expression } from '../Expression';
import { Path } from '../Path';
import { Factual } from '../Factual';
import { MaybeVector, Result } from '../types';
import { Explanation } from '../Explanation';

export class DependencyExpression<T> extends Expression<T> {
  constructor(public readonly path: Path) {
    super();
  }

  public override get(factual: Factual, ...children: Expression<any>[]): Result<T> {
    const vect = this.getVector(factual, ...children);
    if (vect.values.length !== 1) {
      if (vect.isComplete) {
        throw new Error(`Path must resolve to a single value: ${this.path.toString()}`);
      }
      return Result.incomplete();
    }
    return vect.values[0];
  }

  public override getVector(factual: Factual, ...children: Expression<any>[]): MaybeVector<Result<T>> {
    return factual.getVect(this.path);
  }

  public override explain(factual: Factual, ...children: Expression<any>[]): Explanation {
    return factual.explain(this.path);
  }
}
