import { ValidationFailure } from './validation';

export enum UserFriendlyEinFailureReason {
  InvalidEin = 'InvalidEin',
  InvalidPrefix = 'InvalidPrefix',
}

export enum EinFailureReason {
  InvalidPrefixLength = 'InvalidPrefixLength',
  InvalidSerialLength = 'InvalidSerialLength',
  InvalidChars = 'InvalidChars',
  InvalidLength = 'InvalidLength',
  InvalidEin = 'InvalidEin',
  InvalidPrefix = 'InvalidPrefix',
}

export class EinValidationFailure extends ValidationFailure {
    constructor(message: string, public reason: EinFailureReason) {
        super(message, reason);
    }
}


export class Ein {
    private static readonly invalidPrefixes = [
        '07', '08', '09', '17', '18', '19', '28', '29', '49', '69',
        '70', '78', '79', '89', '96', '97',
    ];

    private static readonly einRegex = /^([0-9]{2})([0-9]{7})$/;

    constructor(public readonly prefix: string, public readonly serial: string) {
        if (this.prefix.length !== 2) {
            throw new EinValidationFailure(
                'Prefix of wrong length',
                EinFailureReason.InvalidPrefixLength
            );
        }
        if (this.serial.length !== 7) {
            throw new EinValidationFailure(
                'Serial of wrong length',
                EinFailureReason.InvalidSerialLength
            );
        }
        if (!/^\d+$/.test(this.prefix) || !/^\d+$/.test(this.serial)) {
            throw new EinValidationFailure(
                'Numbers only',
                EinFailureReason.InvalidChars
            );
        }
        if (Ein.invalidPrefixes.includes(this.prefix)) {
            throw new EinValidationFailure(
                'valid prefixes only',
                EinFailureReason.InvalidPrefix
            );
        }
    }

    public toString(): string {
        return `${this.prefix}-${this.serial}`;
    }

    public static parseString(s: string): Ein | undefined {
        const cleanInput = s.replace(/[^0-9]/g, '');
        const match = cleanInput.match(this.einRegex);
        if (match) {
            const [, prefix, serial] = match;
            try {
                return new Ein(prefix, serial);
            } catch (e) {
                return undefined;
            }
        }
        return undefined;
    }

    public static fromString(s: string): Ein {
        const cleanInput = s.replace(/[^0-9]/g, '');
        const match = cleanInput.match(Ein.einRegex);
        if (match) {
            const [, prefix, serial] = match;
            return new Ein(prefix, serial);
        }
        throw new EinValidationFailure(
            'EINs must be 9 digits long',
            EinFailureReason.InvalidLength
        );
    }
}
