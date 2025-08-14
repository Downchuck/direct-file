import { MaybeVector } from './types/MaybeVector';
import { Result } from './types/Result';
import { Address } from './types/Address';
import { Dollar } from './types/Dollar';
import { Rational } from './types/Rational';
import { Ein, EinFailureReason, EinValidationFailure } from './types/Ein';
import { ValidationFailure } from './types/validation';
import { EmailAddress } from './types/EmailAddress';
import { Enum } from './types/Enum';
import { Tin } from './types/Tin';

export {
  MaybeVector,
  Result,
  Address,
  Dollar,
  Rational,
  Ein,
  EinFailureReason,
  EinValidationFailure,
  ValidationFailure,
  EmailAddress,
  Enum,
  Tin,
};

// This is a placeholder. I will add to this as I migrate each type.
import { Collection } from './types/Collection';

export type WritableType =
  | boolean
  | number
  | string
  | Address
  | Dollar
  | Rational
  | Ein
  | EmailAddress
  | Enum
  | Tin
  | Collection<any>;
