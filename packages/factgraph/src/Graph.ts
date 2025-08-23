import { Fact } from './Fact';
import { FactDictionary } from './FactDictionary';
import { Path } from './Path';
import { Persister } from './persisters/Persister';
import { MaybeVector, Result, WritableType } from './types';
import { Factual } from './Factual';

export class Graph {
  public readonly root: Fact;
  public readonly factCache = new Map<string, Fact | undefined>();
  private readonly resultCache = new Map<string, MaybeVector<Result<any>>>();

  constructor(
    public readonly dictionary: FactDictionary,
    public readonly persister: Persister
  ) {
    // This is a temporary solution. The CompNode for the root should be a proper RootNode.
    const rootCompNode = {} as any;
    this.root = new Fact(
      rootCompNode,
      Path.Root,
      [],
      this,
      undefined,
      {} as any
    );
  }

  public get(path: string | Path): Result<any> {
    const results = this.getVect(path);
    if (results.values.length !== 1) {
      throw new Error(`Path must resolve to a single value: ${path.toString()}`);
    }
    return results.values[0];
  }

  public getVect(path: string | Path, factual: Factual): MaybeVector<Result<any>> {
    const pathObj = typeof path === 'string' ? Path.fromString(path) : path;
    const factResults = this.root.apply(pathObj);

    return factResults.flatMap((factResult: Result<Fact>) => {
      if (!factResult.isComplete || !factResult.value) {
        // In Scala, this would return a placeholder. For now, we'll just return an incomplete result.
        return MaybeVector.single(Result.incomplete());
      }
      return factResult.value.get(factual);
    });
  }

  public explain(path: string | Path): any {
    throw new Error('Not implemented');
  }

  public set(path: string | Path, value: WritableType): void {
    const pathObj = typeof path === 'string' ? Path.fromString(path) : path;
    const factResults = this.root.apply(pathObj);

    factResults.foreach((factResult: Result<Fact>) => {
      if (factResult.isComplete && factResult.value) {
        factResult.value.set(value);
      }
    });
  }

  public delete(path: string | Path): void {
    throw new Error('Not implemented');
  }

  public checkPersister(): any[] {
    throw new Error('Not implemented');
  }

  public save(): [boolean, any[]] {
    this.factCache.clear();
    this.resultCache.clear();
    // const out = this.persister.save();
    // if (!out[0]) {
    //   this.resultCache.clear();
    // }
    // return out;
    throw new Error('Not implemented');
  }

  public getDictionary(): FactDictionary {
    return this.dictionary;
  }

  public getCollectionPaths(collectionPath: string): string[] {
    throw new Error('Not implemented');
  }
}
