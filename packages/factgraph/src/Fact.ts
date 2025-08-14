import { CompNode } from './compnodes/CompNode';
import { Path } from './Path';
import { PathItem } from './PathItem';
import { Limit } from './limits/Limit';
import { Graph } from './Graph';
import { MaybeVector, Result, WritableType } from './types';
import { Factual } from './Factual';
import { Explanation } from './Explanation';

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
    let current: Fact = this;
    while (current.parent) {
      current = current.parent;
    }
    return current;
  }

  public get(factual: Factual): MaybeVector<Result<any>> {
    const result = MaybeVector.single(this.value.get(factual));
    console.log('fact.get', result);
    return result;
  }

  public getThunk(factual: Factual): MaybeVector<Result<any>> {
    return MaybeVector.single(this.value.getThunk(factual).get);
  }

  public explain(factual: Factual): MaybeVector<Explanation> {
    return MaybeVector.single(this.value.explain(factual));
  }

  public set(value: WritableType, allowCollectionItemDelete: boolean = false): void {
    this.value.set(value, allowCollectionItemDelete);
  }

  public validate(): any[] {
    throw new Error('Not implemented');
  }

  public delete(): void {
    this.value.delete();
  }

  public apply(path: Path): MaybeVector<Result<Fact>> {
    if (path.absolute) {
      return this.root.apply(path);
    }

    let current: MaybeVector<Result<Fact>> = MaybeVector.single(
      Result.complete(this)
    );

    for (const item of path.items) {
      current = current.flatMap((result) => {
        if (!result.isComplete) {
          return MaybeVector.single(Result.incomplete());
        }
        if (!result.value) {
          return MaybeVector.empty();
        }
        return result.value.applyItem(item);
      });
    }

    return current;
  }

  private applyItem(item: PathItem): MaybeVector<Result<Fact>> {
    if (item.type === 'parent') {
      if (this.parent) {
        return MaybeVector.single(Result.complete(this.parent));
      } else {
        return MaybeVector.empty();
      }
    }
    // TODO: Implement other cases
    throw new Error('Not implemented');
  }
}
