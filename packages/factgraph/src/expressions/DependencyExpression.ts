import { Expression } from '../Expression';
import { Path } from '../Path';
import { Factual } from '../Factual';
import { MaybeVector, Result } from '../types';
import { Explanation } from '../Explanation';
import { Thunk } from '../Thunk';

export class DependencyExpression<T> extends Expression<T> {
  constructor(public readonly path: Path) {
    super();
  }

  public get(factual: Factual): Result<T> {
    return factual.get(this.path);
  }

  public override getVector(factual: Factual): MaybeVector<Thunk<Result<T>>> {
    const factVect = factual.getVect(this.path);
    return factVect.map(result => {
        if (result.isComplete) {
            const fact = result.value;
            return new Thunk(() => {
                const res = fact.get(factual).values[0];
                return res;
            });
        } else {
            return new Thunk(() => Result.incomplete<T>());
        }
    });
  }

  public explain(factual: Factual): Explanation {
    // TODO: Implement this
    return factual.explain(this.path);
  }
}
