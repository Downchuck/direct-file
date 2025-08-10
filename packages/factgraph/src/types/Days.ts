export class Days {
  constructor(public readonly value: number) {}

  public static fromString(s: string): Days {
    return new Days(parseInt(s, 10));
  }

  public static fromNumber(n: number): Days {
    return new Days(n);
  }
}
