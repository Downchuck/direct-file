export class PathItem {
  constructor(public readonly key: string, public readonly type: 'child' | 'parent' | 'wildcard' | 'unknown' | 'collection-member') {}

  public static fromString(value: string): PathItem {
    if (value === '..') {
      return new PathItem(value, 'parent');
    }
    if (value === '*') {
      return new PathItem(value, 'wildcard');
    }
    if (value === '?') {
      return new PathItem(value, 'unknown');
    }
    if (value.startsWith('#')) {
      return new PathItem(value, 'collection-member');
    }
    return new PathItem(value, 'child');
  }

  public get isParent(): boolean {
    return this.type === 'parent';
  }

  public get isWildcard(): boolean {
    return this.type === 'wildcard';
  }

  public get isUnknown(): boolean {
    return this.type === 'unknown';
  }

  public get isCollectionMember(): boolean {
    return this.type === 'collection-member';
  }

  public get isAbstract(): boolean {
    return !this.isCollectionMember;
  }

  public get isKnown(): boolean {
    return !this.isUnknown;
  }

  public get value(): string {
    return this.key;
  }

  public toString(): string {
    return this.key;
  }

  public static readonly Parent = new PathItem('..', 'parent');
  public static readonly Wildcard = new PathItem('*', 'wildcard');
  public static readonly Unknown = new PathItem('?', 'unknown');
}
