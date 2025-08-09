import Decimal from 'decimal.js';

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

export class DollarValidationError extends Error {
  constructor(
    public validationMessage: DollarFailureReason,
    message?: string,
  ) {
    super(message);
    this.name = 'DollarValidationError';
  }
}

const SCALE = 2;
Decimal.set({ rounding: Decimal.ROUND_HALF_EVEN, toExpNeg: -7, toExpPos: 21 });

export class Dollar {
  constructor(public value: Decimal) {
    this.value = value.toDecimalPlaces(SCALE);
  }

  static fromString(s: string, allowRounding = true): Dollar {
    const decimalCount = s.split('.').length - 1;
    if (decimalCount > 1) {
      throw new DollarValidationError(
        DollarFailureReason.TooManyDecimals,
        'At most one decimal value is allowed.',
      );
    }

    const hyphenCount = s.split('-').length - 1;
    let normalizedString = s;

    if (s.startsWith('(') && s.endsWith(')')) {
      if (hyphenCount > 0) {
        throw new DollarValidationError(
          DollarFailureReason.CombinedHyphensAndParentheses,
          'Cannot combine parentheses and hyphens',
        );
      }
      normalizedString = `-${s.substring(1, s.length - 1)}`;
    }

    if (
      normalizedString.includes('(') ||
      normalizedString.includes(')')
    ) {
      throw new DollarValidationError(
        DollarFailureReason.InvalidParentheses,
        'Parentheses not allowed unless they are both the first and last character',
      );
    }

    const isHyphenated = normalizedString.startsWith('-');
    if (hyphenCount > 1 || (hyphenCount === 1 && !isHyphenated)) {
      throw new DollarValidationError(
        DollarFailureReason.InvalidHyphens,
        'At most one hyphen allowed and must be at the beginning of the number if provided',
      );
    }

    const withoutCommas = normalizedString.replace(/,/g, '');
    if (!/^-?(\d+)\.?(\d+)?$/.test(withoutCommas)) {
        throw new DollarValidationError(
            DollarFailureReason.InvalidCharacters,
            `Invalid Characters ${normalizedString}`,
        );
    }

    const fractionalDigits = withoutCommas.split('.')[1];
    if (!allowRounding && fractionalDigits && fractionalDigits.length > 2) {
      throw new DollarValidationError(
        DollarFailureReason.TooManyFractionalDigits,
        'Invalid Fractional Digits',
      );
    }

    return new Dollar(new Decimal(withoutCommas));
  }

  plus(y: Dollar): Dollar {
    return new Dollar(this.value.plus(y.value));
  }

  minus(y: Dollar): Dollar {
    return new Dollar(this.value.minus(y.value));
  }

  times(y: Dollar): Dollar {
    return new Dollar(this.value.times(y.value));
  }

  div(y: Dollar): Dollar {
    return new Dollar(this.value.div(y.value));
  }

  lt(y: Dollar): boolean {
    return this.value.lt(y.value);
  }

  gt(y: Dollar): boolean {
    return this.value.gt(y.value);
  }

  lte(y: Dollar): boolean {
    return this.value.lte(y.value);
  }

  gte(y: Dollar): boolean {
    return this.value.gte(y.value);
  }

  intValue(): number {
    return this.value.floor().toNumber();
  }

  round(): Dollar {
    return new Dollar(this.value.toDecimalPlaces(0));
  }

  toString(): string {
    return this.value.toFixed(SCALE);
  }
}
