export class EmailAddress {
  private static readonly simpleEmailPattern = /^(.+@.+)$/;

  constructor(public readonly email: string) {
    if (!EmailAddress.simpleEmailPattern.test(email)) {
      throw new Error('Email address must have an @ in it');
    }
  }

  public toString(): string {
    return this.email;
  }

  public static fromString(s: string): EmailAddress {
    return new EmailAddress(s);
  }
}
