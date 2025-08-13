import { describe, it, expect } from 'vitest';
import { Tin, TinFailureReason, TinValidationFailure } from '../types/Tin';

describe('Tin', () => {
  it('should create a Tin from a valid string', () => {
    const tin = Tin.fromString('123456789');
    expect(tin.area).toBe('123');
    expect(tin.group).toBe('45');
    expect(tin.serial).toBe('6789');
  });

  it('should create a Tin from a string with dashes', () => {
    const tin = Tin.fromString('123-45-6789');
    expect(tin.toString()).toBe('123-45-6789');
  });

  it('should throw an error for an invalid length', () => {
    expect(() => Tin.fromString('123')).toThrow(TinValidationFailure);
    expect(() => Tin.fromString('123')).toThrow(
      'TINs must be 9 digits long'
    );
  });

  it('should throw an error for invalid characters', () => {
    expect(() => Tin.fromString('123-45-678a')).toThrow(TinValidationFailure);
  });

  it('should throw an error for area 000', () => {
    expect(() => Tin.fromString('000-45-6789')).toThrow(TinValidationFailure);
  });

  it('should not throw an error for area 000 if allowAllZeros is true', () => {
    const tin = Tin.fromString('000-00-0000', true);
    expect(tin.toString()).toBe('000-00-0000');
  });

  it('should throw an error for area 666', () => {
    expect(() => Tin.fromString('666-45-6789')).toThrow(TinValidationFailure);
  });

  describe('isITIN', () => {
    it('should return true for a valid ITIN', () => {
      const tin = Tin.fromString('900-50-1234');
      expect(tin.isITIN()).toBe(true);
    });

    it('should return false for a non-ITIN', () => {
      const tin = Tin.fromString('123-45-6789');
      expect(tin.isITIN()).toBe(false);
    });
  });

  describe('isSSN', () => {
    it('should return true for a valid SSN', () => {
      const tin = Tin.fromString('123-45-6789');
      expect(tin.isSSN()).toBe(true);
    });

    it('should return false for an ITIN', () => {
      const tin = Tin.fromString('900-50-1234');
      expect(tin.isSSN()).toBe(false);
    });
     it('should return false for ssn with all zero serial', () => {
      const tin = Tin.fromString('123-45-0000');
      expect(tin.isSSN()).toBe(false);
    });
  });

  describe('isATIN', () => {
    it('should return true for a valid ATIN', () => {
      const tin = Tin.fromString('900-93-1234');
      expect(tin.isATIN()).toBe(true);
    });

    it('should return false for a non-ATIN', () => {
      const tin = Tin.fromString('900-50-1234');
      expect(tin.isATIN()).toBe(false);
    });
  });
});
