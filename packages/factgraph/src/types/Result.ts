export class Result<A> {
  private constructor(
    public readonly value: A | undefined,
    public readonly isComplete: boolean,
    public readonly isPlaceholder: boolean
  ) {}

  public static complete<A>(value: A): Result<A> {
    return new Result(value, true, false);
  }

  public static placeholder<A>(value: A): Result<A> {
    return new Result(value, false, true);
  }

  public static incomplete<A>(): Result<A> {
    return new Result<A>(undefined, false, false);
  }

  public get isIncomplete(): boolean {
    return !this.isComplete && !this.isPlaceholder;
  }

  public get hasValue(): boolean {
    return this.value !== undefined;
  }

  public get get(): A {
    if (this.value === undefined) {
      throw new Error(
        'Attempted to retrieve the value of an incomplete result'
      );
    }
    return this.value;
  }

  public getOrElse(defaultValue: A): A {
    return this.value === undefined ? defaultValue : this.value;
  }

  public orElse(defaultValue: A): Result<A> {
    if (this.value === undefined) {
      return Result.placeholder(defaultValue);
    }
    return this;
  }

  public asPlaceholder(): Result<A> {
    if (this.isComplete) {
      return Result.placeholder(this.get);
    }
    return this;
  }

  public map<B>(f: (value: A) => B): Result<B> {
    if (this.value === undefined) {
      return Result.incomplete<B>();
    }
    const newValue = f(this.get);
    if (this.isComplete) {
      return Result.complete(newValue);
    }
    return Result.placeholder(newValue);
  }

  public flatMap<B>(f: (value: A) => Result<B>): Result<B> {
    if (this.value === undefined) {
      return Result.incomplete<B>();
    }
    const newResult = f(this.get);
    if (this.isComplete) {
      return newResult;
    }
    return newResult.asPlaceholder();
  }

  public foreach(f: (value: A) => void): void {
    if (this.value !== undefined) {
      f(this.get);
    }
  }

  public toString(): string {
    const valueFmt = this.value === undefined ? '???' : this.value;
    const completeFmt = this.isComplete ? 'complete' : 'incomplete';
    return `Result(${valueFmt}, ${completeFmt})`;
  }
}
