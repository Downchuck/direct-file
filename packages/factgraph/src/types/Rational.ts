import { gcd } from '../util/Math';

export class Rational {
  constructor(public readonly n: number, public readonly d: number) {
    if (d === 0) {
      throw new Error('Denominator cannot be zero');
    }
  }

  public get numerator(): number {
    return this.n;
  }

  public get denominator(): number {
    return this.d;
  }

  public get reciprocal(): Rational {
    if (this.n === 0) {
      throw new Error('reciprocal of zero');
    }
    return new Rational(this.d, this.n);
  }

  public simplify(): Rational {
    const divisor = gcd(this.n, this.d) * (this.d < 0 ? -1 : 1);
    return new Rational(this.n / divisor, this.d / divisor);
  }

  public add(that: Rational): Rational {
    if (this.d === that.d) {
      return new Rational(this.n + that.n, this.d);
    }
    return new Rational(
      this.n * that.d + that.n * this.d,
      this.d * that.d
    ).simplify();
  }

  public sub(that: Rational): Rational {
    if (this.d === that.d) {
      return new Rational(this.n - that.n, this.d);
    }
    return new Rational(
      this.n * that.d - that.n * this.d,
      this.d * that.d
    ).simplify();
  }

  public mul(that: Rational): Rational {
    return new Rational(this.n * that.n, this.d * that.d).simplify();
  }

  public div(that: Rational): Rational {
    if (that.n === 0) {
      throw new Error('divide by zero');
    }
    return new Rational(this.n * that.d, this.d * that.n).simplify();
  }

  public lt(that: Rational): boolean {
    return this.n * that.d < that.n * this.d;
  }

  public gt(that: Rational): boolean {
    return this.n * that.d > that.n * this.d;
  }

  public lte(that: Rational): boolean {
    return this.n * that.d <= that.n * this.d;
  }

  public gte(that: Rational): boolean {
    return this.n * that.d >= that.n * this.d;
  }

  public equals(that: Rational): boolean {
    const simplifiedThis = this.simplify();
    const simplifiedThat = that.simplify();
    return (
      simplifiedThis.n === simplifiedThat.n &&
      simplifiedThis.d === simplifiedThat.d
    );
  }

  public toString(): string {
    return `${this.n}/${this.d}`;
  }

  public static fromString(str: string): Rational {
    const match = str.match(/^(-?\d+)\/(-?\d+)$/);
    if (match) {
      return new Rational(parseInt(match[1], 10), parseInt(match[2], 10));
    }
    throw new Error(`For input string: "${str}"`);
  }

  public static fromNumber(n: number): Rational {
    return new Rational(n, 1);
  }
}
