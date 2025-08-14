export class Address {
  constructor(
    public readonly streetAddress: string,
    public readonly city: string,
    public readonly postalCode: string,
    public readonly stateOrProvence: string,
    public readonly streetAddressLine2: string = '',
    public readonly country: string = 'USA'
  ) {}

  public static fromString(s: string): Address | undefined {
    if (!s) {
      return undefined;
    }
    const parts = s.split('\n');
    const streetAddress = parts[0];
    const cityStateZip = parts[1].split(',');
    const city = cityStateZip[0];
    const stateZip = cityStateZip[1].trim().split(' ');
    const state = stateZip[0];
    const postalCode = stateZip[1];
    return new Address(streetAddress, city, postalCode, state);
  }

  public isForeignAddress(): boolean {
    return this.country !== 'USA';
  }
}
