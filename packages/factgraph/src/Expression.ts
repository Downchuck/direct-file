import { Factual } from './Factual';
import { Thunk } from './Thunk';
import { Result } from './types';
import { Explanation, ConstantExplanation } from './Explanation';
import { UnaryOperator } from './operators/UnaryOperator';

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

  public set(value: any, allowCollectionItemDelete: boolean = false): void {
    throw new Error('Not implemented');
  }

  public delete(): void {
    throw new Error('Not implemented');
  }

  public get isWritable(): boolean {
    return false;
  }

  public map<U>(f: (t: Result<T>) => Result<U>): Expression<U> {
    return new MappedExpression(this, f);
  }

  static switch<T>(
    cases: [Expression<boolean>, Expression<T>][]
  ): Expression<T> {
    return new SwitchExpression(cases);
  }
}

class LiteralExpression<T> extends Expression<T> {
  constructor(private value: Result<T>) {
    super();
  }

  public get(factual: Factual): Result<T> {
    return this.value;
  }

  public explain(factual: Factual): Explanation {
    return new ConstantExplanation();
  }

  override set(value: any, allowCollectionItemDelete: boolean = false): void {
    this.value = Result.complete(value);
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

class MappedExpression<T, U> extends Expression<U> {
  constructor(
    private readonly source: Expression<T>,
    private readonly f: (t: Result<T>) => Result<U>
  ) {
    super();
  }

  public get(factual: Factual): Result<U> {
    return this.f(this.source.get(factual));
  }

  public explain(factual: Factual): Explanation {
    return this.source.explain(factual);
  }
}

export class SwitchExpression<A> extends Expression<A> {
  constructor(
    public readonly cases: [Expression<boolean>, Expression<A>][]
  ) {
    super();
  }

  override get(factual: Factual): Result<A> {
    for (const [when, then] of this.cases) {
      const whenResult = when.get(factual);
      if (whenResult.isComplete && whenResult.value) {
        return then.get(factual);
      }
    }
    return Result.incomplete();
  }

  override explain(factual: Factual): Explanation {
    // TODO: Implement this
    return new ConstantExplanation();
  }
}
