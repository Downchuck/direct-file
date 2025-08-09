import { z } from 'zod';

export enum UserFriendlyAddressFailureReason {
  InvalidAddress = 'InvalidAddress',
  InvalidCity = 'InvalidCity',
  InvalidStateFormat = 'InvalidStateFormat',
  InvalidZipCodeFormat = 'InvalidZipCodeFormat',
}

export enum AddressFailureReason {
  RequiredField = 'RequiredField',
  InvalidStreetLength = 'InvalidStreetLength',
  InvalidStreetChars = 'InvalidStreetChars',
  InvalidStreetLine2Length = 'InvalidStreetLine2Length',
  InvalidStreetUnknownFailure = 'InvalidStreetUnknownFailure',
  InvalidCityLength = 'InvalidCityLength',
  InvalidCityChars = 'InvalidCityChars',
  InvalidCityBasedOnState = 'InvalidCityBasedOnState',
  InvalidCity = 'InvalidCity',
  InvalidCityUnknownFailure = 'InvalidCityUnknownFailure',
  InvalidStateFormat = 'InvalidStateFormat',
  InvalidStateBasedOnCity = 'InvalidStateBasedOnCity',
  InvalidStateUnknownFailure = 'InvalidStateUnknownFailure',
  InvalidZipCodeFormat = 'InvalidZipCodeFormat',
  InvalidZipCodeUknownFailure = 'InvalidZipCodeUknownFailure',
  InvalidAddress = 'InvalidAddress',
}

export const toUserFriendlyReason = (
  reason: AddressFailureReason,
): UserFriendlyAddressFailureReason => {
  switch (reason) {
    case AddressFailureReason.InvalidStreetLength:
    case AddressFailureReason.InvalidStreetChars:
      return UserFriendlyAddressFailureReason.InvalidAddress;
    case AddressFailureReason.InvalidCityLength:
    case AddressFailureReason.InvalidCityChars:
    case AddressFailureReason.InvalidCityBasedOnState:
      return UserFriendlyAddressFailureReason.InvalidCity;
    case AddressFailureReason.InvalidStateBasedOnCity:
      return UserFriendlyAddressFailureReason.InvalidStateFormat;
    case AddressFailureReason.InvalidZipCodeFormat:
      return UserFriendlyAddressFailureReason.InvalidZipCodeFormat;
    default:
      return UserFriendlyAddressFailureReason.InvalidAddress;
  }
};

export class AddressFieldValidationError extends Error {
  constructor(
    public validationMessage: AddressFailureReason,
    message?: string,
  ) {
    super(message);
    this.name = 'AddressFieldValidationError';
  }
}

export class AddressValidationError extends Error {
  constructor(
    public validationMessage: AddressFailureReason,
    public addressErrors: Record<string, AddressFieldValidationError> = {},
    message?: string,
  ) {
    super(message);
    this.name = 'AddressValidationError';
  }
}

const StreetPattern = /[A-Za-z0-9]( ?[A-Za-z0-9\-/])*/;
const StreetPatternLength = /^[a-zA-Z0-9\-\/ ]{1,35}$/;
const CityPattern = /^([A-Za-z ])+$/;
const StatePattern = /^[A-Z]{2}$/;
const ZipCodePattern = /(\d{5})|(\d{5}-\d{4})|(\d{5}-\d{7})/;

const MilitaryPosts = ['AA', 'AE', 'AP'];
const MilitaryCities = ['APO', 'DPO', 'FPO'];

export const AddressSchema = z
  .object({
    streetAddress: z
      .string()
      .min(1, { message: AddressFailureReason.RequiredField })
      .regex(StreetPattern, { message: AddressFailureReason.InvalidStreetChars })
      .regex(StreetPatternLength, {
        message: AddressFailureReason.InvalidStreetLength,
      }),
    streetAddressLine2: z
      .string()
      .optional()
      .refine(
        (val) => !val || StreetPattern.test(val),
        AddressFailureReason.InvalidStreetChars,
      )
      .refine(
        (val) => !val || StreetPatternLength.test(val),
        AddressFailureReason.InvalidStreetLine2Length,
      ),
    city: z
      .string()
      .min(1, { message: AddressFailureReason.RequiredField })
      .regex(CityPattern, { message: AddressFailureReason.InvalidCityChars })
      .min(3, { message: AddressFailureReason.InvalidCityLength })
      .max(22, { message: AddressFailureReason.InvalidCityLength }),
    stateOrProvence: z
      .string()
      .min(1, { message: AddressFailureReason.RequiredField })
      .regex(StatePattern, { message: AddressFailureReason.InvalidStateFormat }),
    postalCode: z
      .string()
      .min(1, { message: AddressFailureReason.RequiredField })
      .regex(ZipCodePattern, {
        message: AddressFailureReason.InvalidZipCodeFormat,
      }),
    country: z.string().default('United States of America'),
  })
  .refine(
    (data) =>
      !MilitaryPosts.includes(data.stateOrProvence) ||
      MilitaryCities.includes(data.city),
    {
      message: AddressFailureReason.InvalidCityBasedOnState,
      path: ['city'],
    },
  )
  .refine(
    (data) =>
      !MilitaryCities.includes(data.city) ||
      MilitaryPosts.includes(data.stateOrProvence),
    {
      message: AddressFailureReason.InvalidStateBasedOnCity,
      path: ['stateOrProvence'],
    },
  );

export type Address = z.infer<typeof AddressSchema>;

export const parseAddress = (data: unknown): Address => {
  try {
    return AddressSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const addressErrors: Record<string, AddressFieldValidationError> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const field = err.path[0] as string;
          addressErrors[field] = new AddressFieldValidationError(
            err.message as AddressFailureReason,
            err.message,
          );
        }
      });
      throw new AddressValidationError(
        AddressFailureReason.InvalidAddress,
        addressErrors,
        'One or more address fields in error',
      );
    }
    throw error;
  }
};

export const addressToString = (address: Address): string => {
  const streetLines = [address.streetAddress, address.streetAddressLine2]
    .filter(Boolean)
    .join('\n');
  return `${streetLines}\n${address.city}, ${address.stateOrProvence} ${address.postalCode}\n${address.country}`;
};

export const formatAddressForHTML = (address: Address): string => {
  const streetLines = [address.streetAddress, address.streetAddressLine2]
    .filter(Boolean)
    .join('<br>');
  return `${streetLines}<br>${address.city}, ${address.stateOrProvence} ${address.postalCode}<br>${address.country}`;
};

export const addressFromString = (s: string): Address => {
  const addressLines = s.split('\n');
  const streetAddress = addressLines[0];
  const [city, stateAndPostalCode] = addressLines[
    addressLines.length - 1
  ].split(',');
  const [state, postalCode] = stateAndPostalCode.trim().split(' ');
  const country = 'United States of America';

  const addressData =
    addressLines.length === 2
      ? {
          streetAddress,
          city,
          postalCode,
          stateOrProvence: state,
          country,
        }
      : {
          streetAddress,
          city,
          postalCode,
          stateOrProvence: state,
          streetAddressLine2: addressLines[1],
          country,
        };

  return parseAddress(addressData);
};
