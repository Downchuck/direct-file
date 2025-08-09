export class PathItem {
  constructor(public readonly value: string) {}

  public static readonly Parent = new PathItem('..');
  public static readonly Wildcard = new PathItem('*');
  public static readonly Unknown = new PathItem('?');

  public static fromString(value: string): PathItem {
    switch (value) {
      case '..':
        return PathItem.Parent;
      case '*':
        return PathItem.Wildcard;
      case '?':
        return PathItem.Unknown;
      default:
        return new PathItem(value);
    }
  }

  public get isParent(): boolean {
    return this === PathItem.Parent;
  }

  public get isWildcard(): boolean {
    return this === PathItem.Wildcard;
  }

  public get isUnknown(): boolean {
    return this === PathItem.Unknown;
  }

  public get isCollectionMember(): boolean {
    return this.value.startsWith('#');
  }

  public get isAbstract(): boolean {
    return !this.isCollectionMember;
  }

  public get isKnown(): boolean {
    return !this.isUnknown;
  }

  public toString(): string {
    return this.value;
  }
}
