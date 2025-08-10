import { Dollar, DollarFailureReason, DollarValidationFailure } from '../types/Dollar';
import { describe, it, expect } from 'vitest';

const assertThrowsWithReason = (
  op: () => any,
  reason: DollarFailureReason
) => {
  try {
    op();
    expect.fail('Expected an error to be thrown');
  } catch (e) {
    expect(e).toBeInstanceOf(DollarValidationFailure);
    expect((e as DollarValidationFailure).validationMessage).toBe(reason);
  }
};

describe('Dollar', () => {
  describe('fromString', () => {
    it('parses whole numbers without decimal values correctly', () => {
      expect(Dollar.fromString('1').toString()).toBe('1.00');
    });

    it('parses whole numbers with a decimal and no cents', () => {
      expect(Dollar.fromString('1.').toString()).toBe('1.00');
    });

    it('parses whole numbers with decimals values correctly', () => {
      expect(Dollar.fromString('1.0').toString()).toBe('1.00');
      expect(Dollar.fromString('1.00').toString()).toBe('1.00');
    });

    it('parses fractional values correctly', () => {
      expect(Dollar.fromString('1.23').toString()).toBe('1.23');
    });

    it('parses hyphenated values as negative', () => {
      expect(Dollar.fromString('-1').toString()).toBe('-1.00');
      expect(Dollar.fromString('-1.23').toString()).toBe('-1.23');
    });

    it('parses parenthetical values as negative', () => {
      expect(Dollar.fromString('(1)').toString()).toBe('-1.00');
      expect(Dollar.fromString('(1.23)').toString()).toBe('-1.23');
    });

    it('allows commas in the whole numbers portion', () => {
      expect(Dollar.fromString('1,234.00').toString()).toBe('1234.00');
      expect(Dollar.fromString('1,234').toString()).toBe('1234.00');
    });

    it('rejects disallowed characters', () => {
      assertThrowsWithReason(
        () => Dollar.fromString('1.0a'),
        DollarFailureReason.InvalidCharacters
      );
      assertThrowsWithReason(
        () => Dollar.fromString('abc'),
        DollarFailureReason.InvalidCharacters
      );
    });

    it('rejects commas in the fractional portion', () => {
      assertThrowsWithReason(
        () => Dollar.fromString('1.2,3'),
        DollarFailureReason.InvalidCharacters
      );
    });

    it('rejects values with more than one decimal', () => {
      assertThrowsWithReason(
        () => Dollar.fromString('1.2.3'),
        DollarFailureReason.TooManyDecimals
      );
    });

    it('rejects values with a hyphen anywhere except the beginning', () => {
      assertThrowsWithReason(
        () => Dollar.fromString('1.-3'),
        DollarFailureReason.InvalidHyphens
      );
    });

    it('rejects values composed of just a pair of parentheses with InvalidParentheses', () => {
      assertThrowsWithReason(
        () => Dollar.fromString('()'),
        DollarFailureReason.InvalidParentheses
      );
    });

    it('rejects values composed of a single hyphen with InvalidHyphens', () => {
      assertThrowsWithReason(
        () => Dollar.fromString('-'),
        DollarFailureReason.InvalidHyphens
      );
    });

    describe('when rounding is not disabled', () => {
      it('accepts values more than two fractional digits', () => {
        expect(Dollar.fromString('1.234').toString()).toBe('1.23');
      });
    });
    describe('when rounding is disabled', () => {
      it('rejects values with more than two fractional digits', () => {
        assertThrowsWithReason(
          () => Dollar.fromString('1.234', false),
          DollarFailureReason.TooManyFractionalDigits
        );
      });
    });

    it('rejects values that contain both hyphens and parentheses', () => {
      assertThrowsWithReason(
        () => Dollar.fromString('(-1)'),
        DollarFailureReason.CombinedHyphensAndParentheses
      );
    });

    it('rejects values with unmatched parentheses', () => {
      assertThrowsWithReason(
        () => Dollar.fromString('(1.0'),
        DollarFailureReason.InvalidParentheses
      );
    });

    it('rejects values with parentheses anywhere except the ends', () => {
      assertThrowsWithReason(
        () => Dollar.fromString('1).0'),
        DollarFailureReason.InvalidParentheses
      );
    });
  });

  describe('add', () => {
    it('adds the values', () => {
      const plus = Dollar.fromString('1.23').add(Dollar.fromString('2.34'));
      expect(plus.toString()).toBe('3.57');
    });
  });

  describe('sub', () => {
    it('subtracts the values', () => {
      const minus = Dollar.fromString('1.23').sub(Dollar.fromString('2.34'));
      expect(minus.toString()).toBe('-1.11');
    });
  });

  describe('mul', () => {
    it('multiplies the values', () => {
      const times = Dollar.fromString('1.23').mul(Dollar.fromString('2.34'));
      expect(times.toString()).toBe('2.88');
    });
  });

  describe('div', () => {
    it('divides the values', () => {
      const div = Dollar.fromString('1.23').div(Dollar.fromString('2.34'));
      expect(div.toString()).toBe('0.53');
    });
  });

  describe('lt', () => {
    it('returns true if the left hand side is less than the right', () => {
      expect(Dollar.fromString('1.23').lt(Dollar.fromString('2.34'))).toBe(true);
      expect(Dollar.fromString('1.23').lt(Dollar.fromString('1.23'))).toBe(false);
      expect(Dollar.fromString('1.23').lt(Dollar.fromString('0.98'))).toBe(false);
    });
  });

  describe('gt', () => {
    it('returns true if the left hand side is greater than the right', () => {
      expect(Dollar.fromString('1.23').gt(Dollar.fromString('2.34'))).toBe(false);
      expect(Dollar.fromString('1.23').gt(Dollar.fromString('1.23'))).toBe(false);
      expect(Dollar.fromString('1.23').gt(Dollar.fromString('0.98'))).toBe(true);
    });
  });

  describe('lte', () => {
    it('returns true if the left hand side is less than or equal to the right', () => {
      expect(Dollar.fromString('1.23').lte(Dollar.fromString('2.34'))).toBe(true);
      expect(Dollar.fromString('1.23').lte(Dollar.fromString('1.23'))).toBe(true);
      expect(Dollar.fromString('1.23').lte(Dollar.fromString('0.98'))).toBe(false);
    });
  });

  describe('gte', () => {.
    it('returns true if the left hand side is greater than or equal to the right', () => {
      expect(Dollar.fromString('1.23').gte(Dollar.fromString('2.34'))).toBe(false);
      expect(Dollar.fromString('1.23').gte(Dollar.fromString('1.23'))).toBe(true);
      expect(Dollar.fromString('1.23').gte(Dollar.fromString('0.98'))).toBe(true);
    });
  });

  describe('toNumber', () => {
    it('returns the number value', () => {
      expect(Dollar.fromString('3.01').toNumber()).toBe(3.01);
      expect(Dollar.fromString('3.99').toNumber()).toBe(3.99);
    });
  });

  describe('round', () => {
    describe('when less than halfway between whole dollar values', () => {
      it('rounds down', () => {
        const roundDown = Dollar.fromString('3.49').round();
        expect(roundDown.toString()).toBe('3.00');
      });
    });

    describe('when halfway between whole dollar values', () => {
      it('rounds up', () => {
        const roundUp = Dollar.fromString('3.50').round();
        expect(roundUp.toString()).toBe('4.00');
      });
    });
  });
});
