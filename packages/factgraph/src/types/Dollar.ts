import { Decimal } from 'decimal.js';

export enum DollarFailureReason {
  InvalidDollar = 'InvalidDollar',
  TooManyDecimals = 'TooManyDecimals',
  InvalidHyphens = 'InvalidHyphens',
  TooManyFractionalDigits = 'TooManyFractionalDigits',
  CombinedHyphensAndParentheses = 'CombinedHyphensAndParentheses',
  InvalidParentheses = 'InvalidParentheses',
  InvalidCharacters = 'InvalidCharacters',
  ExceedsMaxLimit = 'ExceedsMaxLimit',
  ExceedsMinLimit = 'ExceedsMinLimit',
}

export class DollarValidationFailure extends Error {
  constructor(
    public readonly message: string,
    public readonly validationMessage: DollarFailureReason
  ) {
    super(message);
  }
}

export class Dollar {
  private static readonly SCALE = 2;
  private static readonly ROUNDING_MODE = Decimal.ROUND_HALF_EVEN;

  private readonly value: Decimal;

  private constructor(value: Decimal) {
    this.value = value.toDecimalPlaces(Dollar.SCALE, Dollar.ROUNDING_MODE);
  }

  public static fromString(s: string, allowRounding: boolean = true): Dollar {
    const decimalCount = (s.match(/\./g) || []).length;
    if (decimalCount > 1) {
      throw new DollarValidationFailure(
        'At most one decimal value is allowed.',
        DollarFailureReason.TooManyDecimals
      );
    }

    const hyphenCount = (s.match(/-/g) || []).length;
    let normalizedString = s;

    if (s.startsWith('(') && s.endsWith(')')) {
      if (s === '()') {
        throw new DollarValidationFailure(
          'Empty parentheses are not allowed',
          DollarFailureReason.InvalidParentheses
        );
      }
      if (hyphenCount > 0) {
        throw new DollarValidationFailure(
          'Cannot combine parentheses and hyphens',
          DollarFailureReason.CombinedHyphensAndParentheses
        );
      }
      normalizedString = `-${s.substring(1, s.length - 1)}`;
    }

    if (
      (normalizedString.match(/\(/g) || []).length > 0 ||
      (normalizedString.match(/\)/g) || []).length > 0
    ) {
      throw new DollarValidationFailure(
        'Parentheses not allowed unless they are both the first and last character',
        DollarFailureReason.InvalidParentheses
      );
    }

    const isHyphenated = normalizedString.startsWith('-');
    const isJustHyphen = normalizedString === '-';
    if (
      isJustHyphen ||
      (hyphenCount > 1 && isHyphenated) ||
      (hyphenCount > 0 && !isHyphenated)
    ) {
      throw new DollarValidationFailure(
        'At most one hyphen allowed and must be at the beginning of the number if provided',
        DollarFailureReason.InvalidHyphens
      );
    }

    const match = normalizedString.match(/^-?([0-9,]+)\.?([0-9]+)?$/);
    if (!match) {
      throw new DollarValidationFailure(
        `Invalid Characters ${normalizedString}`,
        DollarFailureReason.InvalidCharacters
      );
    }

    const fractionalDigits = match[2];
    if (!allowRounding && fractionalDigits && fractionalDigits.length > 2) {
      throw new DollarValidationFailure(
        'Invalid Fractional Digits',
        DollarFailureReason.TooManyFractionalDigits
      );
    }

    return new Dollar(new Decimal(normalizedString.replace(/,/g, '')));
  }

  public static fromNumber(n: number): Dollar {
    return new Dollar(new Decimal(n));
  }

  public add(other: Dollar): Dollar {
    return new Dollar(this.value.add(other.value));
  }

  public sub(other: Dollar): Dollar {
    return new Dollar(this.value.sub(other.value));
  }

  public mul(other: Dollar): Dollar {
    return new Dollar(this.value.mul(other.value));
  }

  public div(other: Dollar): Dollar {
    return new Dollar(this.value.div(other.value));
  }

  public lt(other: Dollar): boolean {
    return this.value.lt(other.value);
  }

  public gt(other: Dollar): boolean {
    return this.value.gt(other.value);
  }

  public lte(other: Dollar): boolean {
    return this.value.lte(other.value);
  }

  public gte(other: Dollar): boolean {
    return this.value.gte(other.value);
  }

  public equals(other: Dollar): boolean {
    return this.value.equals(other.value);
  }

  public round(): Dollar {
    return new Dollar(this.value.toDecimalPlaces(0, Decimal.ROUND_HALF_UP));
  }

  public toNumber(): number {
    return this.value.toNumber();
  }

  public toString(): string {
    return this.value.toFixed(Dollar.SCALE);
  }

  public static readonly zero = Dollar.fromNumber(0);
}
