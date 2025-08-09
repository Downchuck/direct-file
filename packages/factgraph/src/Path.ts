import { PathItem } from './PathItem';
import { Graph } from './Graph';

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

  public populateWildcards(graph: Graph): Path[] {
    // TODO: Implement this
    throw new Error('Not implemented');
  }

  public toString(): string {
    const prefix = this.absolute ? Path.Delimiter : '';
    const path = this.items.map((item) => item.toString()).join(Path.Delimiter);
    return `${prefix}${path}`;
  }
}
