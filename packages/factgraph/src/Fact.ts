import { CompNode } from './compnodes/CompNode';
import { Path } from './Path';
import { PathItem } from './PathItem';
import { Limit } from './limits/Limit';
import { Graph } from './Graph';
import { MaybeVector, Result, WritableType } from './types';

// In Scala, Factual.Meta was a class. Here, we can use an interface.
export interface FactualMeta {
  // ...
}

export class Fact {
  constructor(
    public readonly value: CompNode,
    public readonly path: Path,
    public readonly limits: Limit[],
    public readonly graph: Graph,
    public readonly parent: Fact | undefined,
    public readonly meta: FactualMeta
  ) {}

  public get root(): Fact {
    let current = this;
    while (current.parent) {
      current = current.parent;
    }
    return current;
  }

  public get(): MaybeVector<Result<any>> {
    // TODO: Implement caching
    // return this.graph.resultCache.getOrElseUpdate(this.path, () => this.value.get());
    throw new Error('Not implemented');
  }

  public getThunk(): MaybeVector<Result<any>> {
    throw new Error('Not implemented');
  }

  public explain(): MaybeVector<any> {
    throw new Error('Not implemented');
  }

  public set(value: WritableType, allowCollectionItemDelete: boolean = false): void {
    throw new Error('Not implemented');
  }

  public validate(): any[] {
    throw new Error('Not implemented');
  }

  public delete(): void {
    throw new Error('Not implemented');
  }

  public apply(path: Path): MaybeVector<Result<Fact>> {
    if (path.absolute) {
      return this.root.apply(path);
    }

    let current: MaybeVector<Result<Fact>> = MaybeVector.single(new Result(this, true));

    for (const item of path.items) {
      current = current.flatMap((result) => {
        if (!result.isComplete) {
          return MaybeVector.single(new Result(undefined, false));
        }
        return result.value.applyItem(item);
      });
    }

    return current;
  }

  private applyItem(item: PathItem): MaybeVector<Result<Fact>> {
    if (item.isParent) {
      if (this.parent) {
        return MaybeVector.single(new Result(this.parent, true));
      } else {
        return MaybeVector.empty();
      }
    }
    // TODO: Implement other cases
    throw new Error('Not implemented');
  }
}
