import { Factual } from './Factual';
import { MaybeVector, Result } from './types';
import { Explanation, ConstantExplanation } from './Explanation';
import { Thunk } from './Thunk';

export abstract class Expression<T> {
  public static literal<T>(value: T): Expression<T> {
    return new LiteralExpression(Result.complete(value));
  }

  public get(factual: Factual, ...children: Expression<any>[]): Result<T> {
    throw new Error(`get not implemented for ${this.constructor.name}`);
  }

  public getThunk(factual: Factual, ...children: Expression<any>[]): Thunk<Result<T>> {
    return new Thunk(() => this.get(factual, ...children));
  }

  public getVector(factual: Factual, ...children: Expression<any>[]): MaybeVector<Result<T>> {
    return MaybeVector.of([this.get(factual, ...children)]);
  }

  public explain(factual: Factual, ...children: Expression<any>[]): Explanation {
    throw new Error(`explain not implemented for ${this.constructor.name}`);
  }
}

class LiteralExpression<T> extends Expression<T> {
  constructor(private readonly value: Result<T>) {
    super();
  }

  public override get(factual: Factual): Result<T> {
    return this.value;
  }

  public override explain(factual: Factual): Explanation {
    return new ConstantExplanation();
  }
}

export class SwitchExpression<T> extends Expression<T> {
    constructor(private readonly cases: [Expression<boolean>, Expression<T>][]) {
        super();
    }

    public override get(factual: Factual, ...children: Expression<any>[]): Result<T> {
        for (const [when, then] of this.cases) {
            const whenResult = when.get(factual);
            if (whenResult.isComplete && whenResult.value) {
                return then.get(factual);
            }
        }
        return Result.incomplete();
    }

    public override explain(factual: Factual, ...children: Expression<any>[]): Explanation {
        // TODO: Implement this
        return new ConstantExplanation();
    }
}
