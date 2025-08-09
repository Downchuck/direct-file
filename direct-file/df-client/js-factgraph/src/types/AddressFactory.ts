import { Address, parseAddress } from './Address';

export const AddressFactory = (
  streetAddress: string,
  city: string,
  postalCode: string,
  stateOrProvence: string,
  streetAddressLine2 = '',
  country = 'United States of America',
): { right: Address } => {
  return {
    right: parseAddress({
      streetAddress,
      city,
      postalCode,
      stateOrProvence,
      streetAddressLine2,
      country,
    }),
  };
};
