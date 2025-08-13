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

export class TinValidationFailure extends Error {
  constructor(
    public readonly message: string,
    public readonly validationMessage: TinFailureReason
  ) {
    super(message);
  }
}

export class Tin {
  private constructor(
    public readonly area: string,
    public readonly group: string,
    public readonly serial: string,
    private readonly allowAllZeros: boolean = false
  ) {
    if (area.length !== 3) {
      throw new TinValidationFailure(
        'Area of wrong length',
        TinFailureReason.InvalidAreaLength
      );
    }
    if (!allowAllZeros && area === '000') {
      throw new TinValidationFailure(
        'Area can not have all zeros',
        TinFailureReason.InvalidTin
      );
    }
    if (area === '666') {
      throw new TinValidationFailure(
        'Area can not have all sixes',
        TinFailureReason.InvalidTin
      );
    }
    if (group.length !== 2) {
      throw new TinValidationFailure(
        'Group of wrong length',
        TinFailureReason.InvalidGroupLength
      );
    }
    if (serial.length !== 4) {
      throw new TinValidationFailure(
        'Serial of wrong length',
        TinFailureReason.InvalidSerialLength
      );
    }
    if (!/^\d+$/.test(area) || !/^\d+$/.test(group) || !/^\d+$/.test(serial)) {
      throw new TinValidationFailure('Numbers only', TinFailureReason.InvalidChars);
    }
  }

  public static fromString(s: string, allowAllZeros: boolean = false): Tin {
    const cleanInput = s.replace(/[^0-9]/g, '');
    const match = cleanInput.match(/^(\d{3})(\d{2})(\d{4})$/);
    if (match) {
      const [, area, group, serial] = match;
      return new Tin(area, group, serial, allowAllZeros);
    } else {
      throw new TinValidationFailure(
        'TINs must be 9 digits long',
        TinFailureReason.InvalidLength
      );
    }
  }

  public toString(): string {
    return `${this.area}-${this.group}-${this.serial}`;
  }

  public isITIN(): boolean {
    if (this.area.startsWith('9')) {
      const numericGroup = parseInt(this.group, 10);
      if (
        numericGroup === 0 || // "00" for testing
        (numericGroup >= 50 && numericGroup <= 65) ||
        (numericGroup >= 70 && numericGroup <= 88) ||
        (numericGroup >= 90 && numericGroup <= 92) ||
        (numericGroup >= 94 && numericGroup <= 99)
      ) {
        return true;
      }
    }
    return false;
  }

  public isSSN(): boolean {
    return (
      !(this.area.startsWith('9') || this.serial === '0000') ||
      (this.allowAllZeros && this.area === '000' && this.group === '00' && this.serial === '0000')
    );
  }

  public isATIN(): boolean {
    return this.area.startsWith('9') && this.group === '93';
  }
}
