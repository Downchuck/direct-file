export class Thunk<A> {
  private value: A | undefined;
  constructor(private f: () => A) {}

  static of<A>(value: A): Thunk<A> {
    return new Thunk(() => value);
  }

  public get get(): A {
    if (this.value === undefined) {
      this.value = this.f();
    }
    return this.value;
  }

  public map<B>(f1: (a: A) => B): Thunk<B> {
    return new Thunk(() => f1(this.get));
  }

  public flatMap<B>(f1: (a: A) => Thunk<B>): Thunk<B> {
    return f1(this.get);
  }
}
