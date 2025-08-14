import { Expression } from '../Expression';
import { Path } from '../Path';
import { Factual } from '../Factual';
import { Result } from '../types';
import { Explanation } from '../Explanation';

export class DependencyExpression<T> extends Expression<T> {
  constructor(public readonly path: Path) {
    super();
  }

  public get(factual: Factual): Result<T> {
    return factual.get(this.path);
  }

  public explain(factual: Factual): Explanation {
    // TODO: Implement this
    return factual.explain(this.path);
  }
}
