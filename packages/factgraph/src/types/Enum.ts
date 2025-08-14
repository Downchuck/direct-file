export class Enum {
  constructor(
    public readonly value: string | undefined,
    public readonly enumOptionsPath: string
  ) {}

  public equals(other: any): boolean {
    if (other instanceof Enum) {
      return (
        other.value === this.value &&
        other.enumOptionsPath === this.enumOptionsPath
      );
    }
    throw new Error('enum must be compared to enum');
  }

  public toString(): string {
    return this.getValue();
  }

  public getValue(): string {
    return this.value ?? '';
  }

  public getEnumOptionsPath(): string {
    return this.enumOptionsPath;
  }

  public static fromString(value: string, enumOptionsPath: string): Enum {
    return new Enum(value, enumOptionsPath);
  }

  public static fromValue(
    value: string | undefined,
    enumOptionsPath: string
  ): Enum {
    return new Enum(value, enumOptionsPath);
  }

  public static fromEnumOptionsPath(enumOptionsPath: string): Enum {
    return new Enum(undefined, enumOptionsPath);
  }
}
