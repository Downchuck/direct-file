import { Expression } from './Expression';
import { Factual } from '../Factual';
import { Path } from '../Path';
import { Result } from '../types/Result';
import { Explanation, WritableExplanation } from '../Explanation';

export class WritableExpression<T> extends Expression<T> {
  constructor(private readonly path: Path) {
    super();
  }

  get(factual: Factual): Result<T> {
    return factual.get(this.path);
  }

  set(factual: Factual, value: any, allowCollectionItemDelete: boolean = false): void {
    factual.set(this.path, value, allowCollectionItemDelete);
  }

  delete(factual: Factual): void {
    factual.delete(this.path);
  }

  public get isWritable(): boolean {
    return true;
  }

  explain(factual: Factual): Explanation {
    const isComplete = factual.get(this.path).isComplete;
    return new WritableExplanation(isComplete, this.path);
  }
}
