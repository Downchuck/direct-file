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

  public override getThunk(factual: Factual): MaybeVector<Thunk<Result<T>>> {
    console.log('factual in getThunk:', factual);
    const factVect = factual.getVect(this.path);
    return factVect.map(result => {
        if (result.isComplete) {
            const fact = result.value;
            return new Thunk(() => {
                const res = fact.get(factual).values[0];
                console.log('thunk result:', res);
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
