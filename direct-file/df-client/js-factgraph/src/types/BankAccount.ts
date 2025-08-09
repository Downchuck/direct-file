import { z } from 'zod';

export enum UserFriendlyBankAccountFailureReason {
  InvalidBankAccount = 'InvalidBankAccount',
  InvalidAccountType = 'InvalidAccountType',
  InvalidRoutingNumber = 'InvalidRoutingNumber',
  MalformedRoutingNumber = 'MalformedRoutingNumber',
  MalformedAccountNumber = 'MalformedAccountNumber',
  InvalidAllZerosAccountNumber = 'InvalidAllZerosAccountNumber',
}

export enum BankAccountFailureReason {
  InvalidBankAccount = 'InvalidBankAccount',
  InvalidAccountType = 'InvalidAccountType',
  MalformedRoutingNumber = 'MalformedRoutingNumber',
  InvalidRoutingNumberChecksum = 'InvalidRoutingNumberChecksum',
  InvalidRoutingNumber = 'InvalidRoutingNumber',
  MalformedAccountNumber = 'MalformedAccountNumber',
  InvalidAllZerosAccountNumber = 'InvalidAllZerosAccountNumber',
}

export const toUserFriendlyReason = (
  reason: BankAccountFailureReason,
): UserFriendlyBankAccountFailureReason => {
  switch (reason) {
    case BankAccountFailureReason.InvalidBankAccount:
      return UserFriendlyBankAccountFailureReason.InvalidBankAccount;
    case BankAccountFailureReason.InvalidAccountType:
      return UserFriendlyBankAccountFailureReason.InvalidAccountType;
    case BankAccountFailureReason.MalformedRoutingNumber:
    case BankAccountFailureReason.InvalidRoutingNumberChecksum:
      return UserFriendlyBankAccountFailureReason.MalformedRoutingNumber;
    case BankAccountFailureReason.InvalidRoutingNumber:
      return UserFriendlyBankAccountFailureReason.InvalidRoutingNumber;
    case BankAccountFailureReason.MalformedAccountNumber:
      return UserFriendlyBankAccountFailureReason.MalformedAccountNumber;
    case BankAccountFailureReason.InvalidAllZerosAccountNumber:
      return UserFriendlyBankAccountFailureReason.InvalidAllZerosAccountNumber;
    default:
      return UserFriendlyBankAccountFailureReason.InvalidBankAccount;
  }
};

export class BankAccountFieldValidationError extends Error {
  constructor(
    public validationMessage: BankAccountFailureReason,
    message?: string,
  ) {
    super(message);
    this.name = 'BankAccountFieldValidationError';
  }
}

export class BankAccountValidationError extends Error {
  constructor(
    public validationMessage: BankAccountFailureReason,
    public fieldErrors: Record<string, BankAccountFieldValidationError> = {},
    message?: string,
  ) {
    super(message);
    this.name = 'BankAccountValidationError';
  }
}

export enum BankAccountType {
  Checking = 'Checking',
  Savings = 'Savings',
}

const routingNumberChecksum = (routingNumber: string): number => {
  let sum = 0;
  for (let i = 0; i < routingNumber.length; i += 3) {
    sum +=
      parseInt(routingNumber[i], 10) * 3 +
      parseInt(routingNumber[i + 1], 10) * 7 +
      parseInt(routingNumber[i + 2], 10);
  }
  return sum;
};

export const BankAccountSchema = z
  .object({
    accountType: z.nativeEnum(BankAccountType),
    routingNumber: z
      .string()
      .length(9, { message: BankAccountFailureReason.InvalidRoutingNumber })
      .regex(/^[0-9]+$/, {
        message: BankAccountFailureReason.InvalidRoutingNumber,
      })
      .regex(
        /^(01|02|03|04|05|06|07|08|09|10|11|12|21|22|23|24|25|26|27|28|29|30|31|32)[0-9]{7}$/,
        { message: BankAccountFailureReason.MalformedRoutingNumber },
      )
      .refine((rn) => routingNumberChecksum(rn) % 10 === 0, {
        message: BankAccountFailureReason.InvalidRoutingNumberChecksum,
      }),
    accountNumber: z
      .string()
      .min(5, { message: BankAccountFailureReason.MalformedAccountNumber })
      .max(17, { message: BankAccountFailureReason.MalformedAccountNumber })
      .regex(/^[0-9A-Z]+$/, {
        message: BankAccountFailureReason.MalformedAccountNumber,
      })
      .refine((an) => !/^0{5,17}$/.test(an), {
        message: BankAccountFailureReason.InvalidAllZerosAccountNumber,
      }),
  });

export type BankAccount = z.infer<typeof BankAccountSchema>;

export const parseBankAccount = (data: unknown): BankAccount => {
  try {
    return BankAccountSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, BankAccountFieldValidationError> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const field = err.path[0] as string;
          fieldErrors[field] = new BankAccountFieldValidationError(
            err.message as BankAccountFailureReason,
            err.message,
          );
        }
      });
      throw new BankAccountValidationError(
        BankAccountFailureReason.InvalidBankAccount,
        fieldErrors,
        'One or more bank account fields in error',
      );
    }
    throw error;
  }
};

export const scalaMapToJsMap = <T>(map: any): Map<string, T> => {
  return new Map(Object.entries(map));
};
