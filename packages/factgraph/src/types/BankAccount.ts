export class BankAccount {
  constructor(
    public readonly accountNumber: string,
    public readonly routingNumber: string
  ) {}

  static fromString(s: string): BankAccount | undefined {
    const parts = s.split(';');
    if (parts.length === 2) {
      return new BankAccount(parts[0], parts[1]);
    }
    return undefined;
  }

  toString(): string {
    return `${this.accountNumber};${this.routingNumber}`;
  }
}
