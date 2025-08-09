import { z } from 'zod';

export enum UserFriendlyTinFailureReason {
  InvalidTin = 'InvalidTin',
}

export enum TinFailureReason {
  InvalidAreaLength = 'InvalidAreaLength',
  InvalidGroupLength = 'InvalidGroupLength',
  InvalidSerialLength = 'InvalidSerialLength',
  InvalidChars = 'InvalidChars',
  InvalidLength = 'InvalidLength',
  InvalidTin = 'InvalidTin',
  InvalidSSN = 'InvalidSSN',
}

export const toUserFriendlyReason = (
  reason: TinFailureReason,
): UserFriendlyTinFailureReason => {
  switch (reason) {
    case TinFailureReason.InvalidAreaLength:
    case TinFailureReason.InvalidGroupLength:
    case TinFailureReason.InvalidSerialLength:
    case TinFailureReason.InvalidChars:
    case TinFailureReason.InvalidLength:
    case TinFailureReason.InvalidTin:
    case TinFailureReason.InvalidSSN:
      return UserFriendlyTinFailureReason.InvalidTin;
    default:
      return UserFriendlyTinFailureReason.InvalidTin;
  }
};

export class TinValidationError extends Error {
  constructor(
    public validationMessage: TinFailureReason,
    message?: string,
  ) {
    super(message);
    this.name = 'TinValidationError';
  }
}

export const TinSchema = z
  .object({
    area: z.string().length(3, { message: TinFailureReason.InvalidAreaLength }),
    group: z.string().length(2, { message: TinFailureReason.InvalidGroupLength }),
    serial: z
      .string()
      .length(4, { message: TinFailureReason.InvalidSerialLength }),
    allowAllZeros: z.boolean().default(false),
  })
  .refine((data) => /^\d+$/.test(data.area), {
    message: TinFailureReason.InvalidChars,
    path: ['area'],
  })
  .refine((data) => /^\d+$/.test(data.group), {
    message: TinFailureReason.InvalidChars,
    path: ['group'],
  })
  .refine((data) => /^\d+$/.test(data.serial), {
    message: TinFailureReason.InvalidChars,
    path: ['serial'],
  })
  .refine((data) => data.allowAllZeros || data.area !== '000', {
    message: TinFailureReason.InvalidTin,
    path: ['area'],
  })
  .refine((data) => data.area !== '666', {
    message: TinFailureReason.InvalidTin,
    path: ['area'],
  });

export type Tin = z.infer<typeof TinSchema>;

export const tinToString = (tin: Tin): string =>
  `${tin.area}-${tin.group}-${tin.serial}`;

export const isITIN = (tin: Tin): boolean => {
  if (tin.area.startsWith('9')) {
    const numericGroup = parseInt(tin.group, 10);
    return (
      numericGroup === 0 ||
      (numericGroup >= 50 && numericGroup <= 65) ||
      (numericGroup >= 70 && numericGroup <= 88) ||
      (numericGroup >= 90 && numericGroup <= 92) ||
      (numericGroup >= 94 && numericGroup <= 99)
    );
  }
  return false;
};

export const isSSN = (tin: Tin): boolean => {
  return (
    !(tin.area.startsWith('9') || tin.serial === '0000') ||
    (tin.allowAllZeros &&
      tin.area === '000' &&
      tin.group === '00' &&
      tin.serial === '0000')
  );
};

export const isATIN = (tin: Tin): boolean => {
  return tin.area.startsWith('9') && tin.group === '93';
};

export const parseTin = (
  s: string,
  allowAllZeros = false,
): Tin | undefined => {
  const cleanInput = s.replaceAll(/[^0-9]/g, '');
  const match = cleanInput.match(/^(\d{3})(\d{2})(\d{4})$/);
  if (match) {
    const [, area, group, serial] = match;
    const result = TinSchema.safeParse({ area, group, serial, allowAllZeros });
    if (result.success) {
      return result.data;
    }
  }
  return undefined;
};

export const createTin = (
  s: string,
  allowAllZeros = false,
): Tin => {
  const tin = parseTin(s, allowAllZeros);
  if (tin) {
    return tin;
  }
  throw new TinValidationError(
    TinFailureReason.InvalidLength,
    'TINs must be 9 digits long',
  );
};
