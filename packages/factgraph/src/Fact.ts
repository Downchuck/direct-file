import { CompNode } from './compnodes/CompNode';
import { compNodeRegistry } from './compnodes/registry';
import { Path } from './Path';
import { PathItem } from './PathItem';
import { Limit } from './limits/Limit';
import { Graph } from './Graph';
import { MaybeVector, Result, WritableType } from './types';
import { Explanation } from './Explanation';
import { CollectionNode } from './compnodes/CollectionNode';
import { Collection } from './types/Collection';

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

  public get(): Result<any> {
    return this.value.get(this.graph);
  }

  public getThunk(): MaybeVector<Thunk<Result<any>>> {
    return this.value.getThunk(this.graph);
  }

  public explain(): MaybeVector<Explanation> {
    return MaybeVector.single(this.value.explain(this.graph));
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
    if (path.absolute && this.parent) {
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
    if (item.type === 'child') {
        return this.applyChild(item);
    }
    if (item.type === 'wildcard') {
        return this.applyWildcard(item);
    }
    if (item.type === 'collection-member') {
        return this.applyMember(item);
    }

    throw new Error(`Not implemented: ${item.type}`);
  }

  private applyChild(item: PathItem): MaybeVector<Result<Fact>> {
      const child = this.getChild(item);
      if (child) {
          return MaybeVector.single(Result.complete(child));
      }
      return MaybeVector.empty();
  }

  private applyWildcard(item: PathItem): MaybeVector<Result<Fact>> {
      if (this.value instanceof CollectionNode) {
          const collectionResult = this.value.expr.get(this.graph);
          if (collectionResult.isComplete) {
              const collection = collectionResult.value as Collection<string>;
              const items = collection.values.map(id => this.getMember(PathItem.fromString(`#${id}`)));
              const validItems = items.filter(i => i !== undefined) as Fact[];
              return MaybeVector.multiple(validItems.map(i => Result.complete(i)), true);
          }
      }
      return MaybeVector.single(Result.incomplete());
  }

  private applyMember(item: PathItem): MaybeVector<Result<Fact>> {
    if (this.value instanceof CollectionNode) {
        const member = this.getMember(item);
        if (member) {
            return MaybeVector.single(Result.complete(member));
        }
    }
    return MaybeVector.single(Result.incomplete());
  }

  private getChild(key: PathItem): Fact | undefined {
    const childPath = this.path.append(key);
    const cached = this.graph.factCache.get(childPath.toString());
    if (cached) {
      return cached;
    }

    const fact = this.makeFact(key);
    this.graph.factCache.set(childPath.toString(), fact);
    return fact;
  }

  private getMember(key: PathItem): Fact | undefined {
    const memberPath = this.path.append(key);
    const cached = this.graph.factCache.get(memberPath.toString());
    if (cached) {
      return cached;
    }

    const fact = this.makeExtract(key);
    this.graph.factCache.set(memberPath.toString(), fact);
    return fact;
  }

  private makeFact(key: PathItem): Fact | undefined {
    const path = this.path.append(key);
    const definition = this.graph.dictionary.getDefinition(path);
    if (definition) {
        if (definition.derived) {
            const compNode = compNodeRegistry.fromDerivedConfig(definition.derived, this.graph);
            return new Fact(compNode, this.path.append(key), [], this.graph, this, {} as any);
        }
        if (definition.writable) {
            const compNode = compNodeRegistry.fromWritableConfig(definition.writable, this.graph);
            return new Fact(compNode, this.path.append(key), [], this.graph, this, {} as any);
        }
    }
    return this.makeExtract(key);
  }

  private makeExtract(key: PathItem): Fact | undefined {
      const extractedNode = this.value.extract(key);
      if (extractedNode) {
          return new Fact(extractedNode, this.path.append(key), [], this.graph, this, {} as any);
      }
      return undefined;
  }
}
