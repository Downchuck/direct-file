import { Graph } from '../Graph';
import { MaybeVector } from '../types/MaybeVector';
import { Thunk } from '../Thunk';
import { Result } from '../types';
import { Explanation, ConstantExplanation } from '../Explanation';
import { UnaryOperator } from '../operators/UnaryOperator';

export abstract class Expression<T> {
  static literal<T>(value: Result<T>): Expression<T> {
    return new LiteralExpression(value);
  }

  static writable<T>(initialValue: Result<T>): Expression<T> {
    return new WritableExpression(initialValue);
  }

  static thunk<T>(value: () => Result<T>): Expression<T> {
    return new ThunkExpression(value);
  }

  public abstract get(graph: Graph): Result<T>;

  public getThunk(graph: Graph): Thunk<Result<T>> {
    return new Thunk(() => this.get(graph));
  }

  public getVector(graph: Graph): MaybeVector<Thunk<Result<T>>> {
    return MaybeVector.single(this.getThunk(graph));
  }

  public abstract explain(graph: Graph): Explanation;

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

  public get(graph: Graph): Result<T> {
    return this.value;
  }

  public explain(graph: Graph): Explanation {
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

  public get(graph: Graph): Result<T> {
    return this.f();
  }

  public explain(graph: Graph): Explanation {
    return new ConstantExplanation();
  }
}

class WritableExpression<T> extends Expression<T> {
  private value: Result<T>;

  constructor(initialValue: Result<T>) {
    super();
    this.value = initialValue;
  }

  public get(graph: Graph): Result<T> {
    return this.value;
  }

  public explain(graph: Graph): Explanation {
    return new ConstantExplanation();
  }

  override set(value: any, allowCollectionItemDelete: boolean = false): void {
    this.value = Result.complete(value);
  }

  override get isWritable(): boolean {
    return true;
  }
}

class MappedExpression<T, U> extends Expression<U> {
  constructor(
    private readonly source: Expression<T>,
    private readonly f: (t: Result<T>) => Result<U>
  ) {
    super();
  }

  public get(graph: Graph): Result<U> {
    return this.f(this.source.get(graph));
  }

  public explain(graph: Graph): Explanation {
    return this.source.explain(graph);
  }
}

export class SwitchExpression<A> extends Expression<A> {
  constructor(
    public readonly cases: [Expression<boolean>, Expression<A>][]
  ) {
    super();
  }

  override get(graph: Graph): Result<A> {
    for (const [when, then] of this.cases) {
      const whenResult = when.get(graph);
      if (whenResult.isComplete && whenResult.value) {
        return then.get(graph);
      }
    }
    return Result.incomplete();
  }

  override explain(graph: Graph): Explanation {
    // TODO: Implement this
    return new ConstantExplanation();
  }
}
