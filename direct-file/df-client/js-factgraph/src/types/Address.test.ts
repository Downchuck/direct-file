import { describe, it, expect } from 'vitest';
import {
  Address,
  AddressFailureReason,
  AddressValidationError,
  addressToString,
  addressFromString,
  parseAddress,
} from './Address';

describe('Address', () => {
  describe('toString', () => {
    it('Converts a simple address to a standard English-formatted address', () => {
      const address: Address = {
        streetAddress: '736 Jackson Place NW',
        city: 'Washington',
        stateOrProvence: 'DC',
        postalCode: '20501',
        country: 'United States of America',
      };
      expect(addressToString(address)).toBe(
        '736 Jackson Place NW\nWashington, DC 20501\nUnited States of America',
      );
    });

    it('Converts an address with a second line to a standard English-formatted address', () => {
      const address: Address = {
        streetAddress: '736 Jackson Place NW',
        streetAddressLine2: '1st floor',
        city: 'Washington',
        stateOrProvence: 'DC',
        postalCode: '20501',
        country: 'United States of America',
      };
      expect(addressToString(address)).toBe(
        '736 Jackson Place NW\n1st floor\nWashington, DC 20501\nUnited States of America',
      );
    });
  });

  describe('addressFromString', () => {
    it('can parse a single address line', () => {
      const expectedAddress: Address = {
        streetAddress: '736 Jackson Place NW',
        city: 'Washington',
        stateOrProvence: 'DC',
        postalCode: '20501',
        country: 'United States of America',
      };
      const parsed = addressFromString('736 Jackson Place NW\nWashington, DC 20501');
      expect(parsed).toEqual(expect.objectContaining(expectedAddress));
      expect(parsed.postalCode).toBe('20501');
    });

    it('can parse a multi-line address', () => {
      const expectedAddress: Address = {
        streetAddress: '736 Jackson Place NW',
        city: 'Washington',
        stateOrProvence: 'DC',
        streetAddressLine2: '812W',
        postalCode: '20501',
        country: 'United States of America',
      };
      const parsed = addressFromString(
        '736 Jackson Place NW\n812W\nWashington, DC 20501',
      );
      expect(parsed).toEqual(expect.objectContaining(expectedAddress));
      expect(parsed.postalCode).toBe('20501');
    });
  });

  describe('preconditions for the street fields', () => {
    it('throws an error because street is required', () => {
      expect(() =>
        parseAddress({
          streetAddress: '',
          city: 'Washington',
          stateOrProvence: 'DC',
          postalCode: '20507',
        }),
      ).toThrow(AddressValidationError);
    });

    it('street line1 is in error due to invalid chars', () => {
      try {
        parseAddress({
          streetAddress: '736 Jackson Place NW $',
          city: 'Washington',
          stateOrProvence: 'DC',
          postalCode: '20507',
        });
      } catch (e) {
        expect(e).toBeInstanceOf(AddressValidationError);
        const err = e as AddressValidationError;
        expect(err.addressErrors.streetAddress.validationMessage).toBe(
          AddressFailureReason.InvalidStreetChars,
        );
      }
    });

    it('street line1 is in error due to going above 35 chars', () => {
        try {
            parseAddress({
              streetAddress: 'abcdefghijklmnopqrstuvqxyz1234567890',
              city: 'Washington',
              stateOrProvence: 'DC',
              postalCode: '20507',
            });
          } catch (e) {
            expect(e).toBeInstanceOf(AddressValidationError);
            const err = e as AddressValidationError;
            expect(err.addressErrors.streetAddress.validationMessage).toBe(
              AddressFailureReason.InvalidStreetLength,
            );
          }
    });
  });

  describe('preconditions for the city field', () => {
    it('disallows special characters in city', () => {
        try {
            parseAddress({
              streetAddress: '736 Jackson Place NW',
              city: 'Washington!',
              stateOrProvence: 'DC',
              postalCode: '20504',
            });
          } catch (e) {
            expect(e).toBeInstanceOf(AddressValidationError);
            const err = e as AddressValidationError;
            expect(err.addressErrors.city.validationMessage).toBe(
              AddressFailureReason.InvalidCityChars,
            );
          }
    });
  });
});
