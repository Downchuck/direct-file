import { MaybeVector } from './types/MaybeVector';
import { Result } from './types/Result';
import { Address } from './types/Address';

export { MaybeVector, Result };

// This is a placeholder. I will add to this as I migrate each type.
export type WritableType =
  | boolean
  | number
  | string
  | Address;
