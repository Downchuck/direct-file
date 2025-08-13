import { Factual } from './Factual';
import { Thunk } from './Thunk';
import { Result } from './types';
import { Explanation, ConstantExplanation } from './Explanation';

export abstract class Expression<T> {
  static literal<T>(value: Result<T>): Expression<T> {
    return new LiteralExpression(value);
  }

  static thunk<T>(value: () => Result<T>): Expression<T> {
    return new ThunkExpression(value);
  }

  public abstract get(factual: Factual): Result<T>;

  public getThunk(factual: Factual): Thunk<Result<T>> {
    return new Thunk(() => this.get(factual));
  }

  public abstract explain(factual: Factual): Explanation;

  public set(factual: Factual, value: any, allowCollectionItemDelete: boolean = false): void {
    throw new Error('Not implemented');
  }

  public delete(factual: Factual): void {
    throw new Error('Not implemented');
  }

  public get isWritable(): boolean {
    return false;
  }
}

class LiteralExpression<T> extends Expression<T> {
  constructor(private readonly value: Result<T>) {
    super();
  }

  public get(factual: Factual): Result<T> {
    return this.value;
  }

  public explain(factual: Factual): Explanation {
    return new ConstantExplanation();
  }
}

class ThunkExpression<T> extends Expression<T> {
  constructor(private readonly f: () => Result<T>) {
    super();
  }

  public get(factual: Factual): Result<T> {
    return this.f();
  }

  public explain(factual: Factual): Explanation {
    return new ConstantExplanation();
  }
}
