export class Thunk<A> {
  private _value: A | undefined;
  constructor(private f: () => A) {}

  static of<A>(value: A): Thunk<A> {
    const thunk = new Thunk(() => value);
    thunk._value = value;
    return thunk;
  }

  public get value(): A {
    if (this._value === undefined) {
      this._value = this.f();
    }
    return this._value!;
  }

  public map<B>(f1: (a: A) => B): Thunk<B> {
    return new Thunk(() => f1(this.value));
  }

  public flatMap<B>(f1: (a: A) => Thunk<B>): Thunk<B> {
    return f1(this.value);
  }
}
