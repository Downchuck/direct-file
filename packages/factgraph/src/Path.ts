import { PathItem } from './PathItem';

export class Path {
  private constructor(
    public readonly items: readonly PathItem[],
    public readonly absolute: boolean
  ) {}

  public static readonly Delimiter = '/';
  public static readonly Root = new Path([], true);
  public static readonly Relative = new Path([], false);

  public static fromString(str: string): Path {
    if (str === Path.Delimiter) {
      return Path.Root;
    }
    if (str === '') {
      return Path.Relative;
    }

    const itemStrs = str.split(Path.Delimiter);
    const absolute = itemStrs[0] === '';
    const items = (absolute ? itemStrs.slice(1) : itemStrs).map((itemStr) =>
      PathItem.fromString(itemStr)
    );

    return new Path(items, absolute);
  }

  public concat(other: Path): Path {
    if (other.absolute) {
      return other;
    }
    return new Path([...this.items, ...other.items], this.absolute);
  }

  public append(item: PathItem): Path {
    return new Path([...this.items, item], this.absolute);
  }

  public get parent(): Path | undefined {
    if (this.items.length === 0) {
      return undefined;
    }
    return new Path(this.items.slice(0, -1), this.absolute);
  }

  public get isAbstract(): boolean {
    return this.absolute && this.items.every((item) => item.isAbstract);
  }

  public get isKnown(): boolean {
    return this.absolute && this.items.every((item) => item.isKnown);
  }

  public get isWildcard(): boolean {
    return this.absolute && this.items.some((item) => item.isWildcard);
  }

  public get isCollectionMember(): boolean {
    return this.absolute && this.items.some((item) => item.isCollectionMember);
  }

  public get isCollectionItem(): boolean {
    return (
      this.absolute &&
      this.items.length > 0 &&
      this.items[this.items.length - 1].isCollectionMember
    );
  }

  public getMemberId(): string | undefined {
    const item = this.items.find((item) => item.isCollectionMember);
    if (!item) {
      return undefined;
    }
    return item.value;
  }

  public toAbstract(): Path {
    const newItems = this.items.map((item) =>
      item.isCollectionMember ? PathItem.Wildcard : item
    );
    return new Path(newItems, this.absolute);
  }

  public toString(): string {
    const prefix = this.absolute ? Path.Delimiter : '';
    const path = this.items.map((item) => item.toString()).join(Path.Delimiter);
    return `${prefix}${path}`;
  }

  public equals(other: Path): boolean {
    if (this.absolute !== other.absolute || this.items.length !== other.items.length) {
      return false;
    }
    for (let i = 0; i < this.items.length; i++) {
      if (!this.items[i].equals(other.items[i])) {
        return false;
      }
    }
    return true;
  }

  public endsWith(item: PathItem): boolean {
    if (this.items.length === 0) {
      return false;
    }
    return this.items[this.items.length - 1].equals(item);
  }

  public relativeTo(base: Path): Path {
    if (!this.absolute || !base.absolute) {
      throw new Error('Can only find relative path for two absolute paths.');
    }

    if (base.items.length > this.items.length) {
      throw new Error(
        `Base path ${base.toString()} cannot be longer than ${this.toString()}`
      );
    }

    for (let i = 0; i < base.items.length; i++) {
      if (!base.items[i].equals(this.items[i])) {
        throw new Error(
          `Path ${this.toString()} does not start with ${base.toString()}`
        );
      }
    }

    const newItems = this.items.slice(base.items.length);
    return new Path(newItems, false); // A relative path
  }

  public matches(other: Path): boolean {
    if (this.items.length !== other.items.length) {
      return false;
    }
    for (let i = 0; i < this.items.length; i++) {
      const thisItem = this.items[i];
      const otherItem = other.items[i];
      if (thisItem.isWildcard) {
        continue;
      }
      if (!thisItem.equals(otherItem)) {
        return false;
      }
    }
    return true;
  }
}
