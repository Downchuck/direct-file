import { Result } from './Result';

export class MaybeVector<A> {
  private constructor(
    public readonly values: A[],
    public readonly isSingle: boolean,
    public readonly isComplete: boolean
  ) {}

  public static single<A>(value: A): MaybeVector<A> {
    return new MaybeVector([value], true, true);
  }

  public static multiple<A>(values: A[], isComplete: boolean): MaybeVector<A> {
    return new MaybeVector(values, false, isComplete);
  }

  public static empty<A>(): MaybeVector<A> {
    return new MaybeVector([], false, true);
  }

  public apply(i: number): A {
    if (this.isSingle) {
      return this.values[0];
    }
    return this.values[i];
  }

  public get toVector(): A[] {
    return this.values;
  }

  public get toList(): A[] {
    return this.values;
  }

  public get length(): number | undefined {
    if (this.isSingle) {
      return undefined;
    }
    return this.values.length;
  }

  public map<B>(f: (value: A) => B): MaybeVector<B> {
    if (this.isSingle) {
      return MaybeVector.single(f(this.values[0]));
    }
    return MaybeVector.multiple(
      this.values.map(f),
      this.isComplete
    );
  }

  public flatMap<B>(f: (value: A) => MaybeVector<B>): MaybeVector<B> {
    if (this.isSingle) {
      return f(this.values[0]);
    }
    const mvs = this.values.map(f);
    const complete = this.isComplete && mvs.every((mv) => mv.isComplete);
    return MaybeVector.multiple(
      mvs.flatMap((mv) => mv.toVector),
      complete
    );
  }

  public foreach(f: (value: A) => void): void {
    this.values.forEach(f);
  }

  public toMultiple(): MaybeVector<A> {
    if (this.isSingle) {
      return MaybeVector.multiple([this.values[0]], true);
    }
    return this;
  }

  public static vectorizeList<A, B, X>(
    f: (h: A, t: B[]) => X,
    head: MaybeVector<A>,
    tail: MaybeVector<B>[]
  ): MaybeVector<X> {
    const all = [head, ...tail];
    const uniqueSizes = [...new Set(all.map((mv) => mv.length).filter((l) => l !== undefined))]

    if (uniqueSizes.length === 0) {
      return MaybeVector.single(f(head.apply(0), tail.map((mv) => mv.apply(0))));
    } else if (uniqueSizes.length === 1) {
      const size = uniqueSizes[0];
      const results = [];
      for (let i = 0; i < size; i++) {
        results.push(f(head.apply(i), tail.map((mv) => mv.apply(i))));
      }
      const complete = all.every((mv) => mv.isComplete);
      return MaybeVector.multiple(results, complete);
    } else {
      throw new Error('Cannot operate on vectors of different lengths');
    }
  }

  public static vectorize2<A, B, X>(
    f: (left: A, right: B) => X,
    lhs: MaybeVector<A>,
    rhs: MaybeVector<B>
  ): MaybeVector<X> {
    return MaybeVector.vectorizeList((h, t) => f(h, t[0]), lhs, [rhs]);
  }

  public static vectorize4<A, B, C, D, X>(
    f: (a: A, b: B, c: C, d: D) => X,
    arg1: MaybeVector<A>,
    arg2: MaybeVector<B>,
    arg3: MaybeVector<C>,
    arg4: MaybeVector<D>
  ): MaybeVector<X> {
    return MaybeVector.vectorizeList((h, t) => f(h, t[0], t[1], t[2]), arg1, [arg2, arg3, arg4]);
  }
}
