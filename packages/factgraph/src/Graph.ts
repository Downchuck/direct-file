import { Fact } from './Fact';
import { FactDictionary } from './FactDictionary';
import { Path, PathItem } from './Path';
import { MaybeVector, Result } from './types';
import { Factual } from './Factual';
import { Explanation } from './Explanation';
import { compNodeRegistry } from './compnodes/registry';
import { v4 as uuidv4 } from 'uuid';
import { CollectionNode } from './compnodes/CollectionNode';

export class Graph {
  public readonly root: Fact;

  constructor(public readonly dictionary: FactDictionary) {
    const rootPath = Path.fromString('/');
    const rootDef = this.dictionary.getDefinition(rootPath);
    if (!rootDef) {
      throw new Error('Root definition not found in dictionary');
    }
    const rootNode = compNodeRegistry.fromDerivedConfig(rootDef.derived, this, []);
    this.root = new Fact(rootNode, rootPath, this, undefined, rootDef);
  }

  public get<T>(path: Path | string): Result<T> {
    const results = this.getVect<T>(path);
    if (results.values.length !== 1) {
      if (results.isComplete) {
        throw new Error(`Path must resolve to a single value: ${path.toString()}`);
      }
      return Result.incomplete();
    }
    return results.values[0];
  }

  public getVect<T>(path: Path | string): MaybeVector<Result<T>> {
    const p = path instanceof Path ? path : Path.fromString(path);
    const facts = this.root.apply(p);
    return facts.flatMap(fact => fact.get(new Factual(this)));
  }

  public explain(path: Path | string): Explanation {
    const p = path instanceof Path ? path : Path.fromString(path);
    const factResults = this.root.apply(p);
    if (factResults.values.length !== 1) {
        throw new Error(`Path must resolve to a single explanation: ${path.toString()}`);
    }
    const fact = factResults.values[0];
    return fact.explain(new Factual(this));
  }

  public set<T>(path: Path | string, value: T): MaybeVector<Fact> {
    const p = path instanceof Path ? path : Path.fromString(path);
    const factResults = this.root.apply(p);
    if (factResults.values.length !== 1) {
        throw new Error(`Set path must resolve to a single fact: ${path.toString()}`);
    }
    const fact = factResults.values[0];

    if (fact.value instanceof CollectionNode && Array.isArray(value)) {
      fact.children = [];
      const newFacts: Fact[] = [];
      for (const item of value) {
        const newId = uuidv4();
        const newPath = p.append(new PathItem(`#${newId}`, 'collection-member'));
        const itemDef = this.dictionary.getDefinition(newPath);
        if (itemDef) {
          const newNode = compNodeRegistry.fromConfig(itemDef, this);
          const newFact = new Fact(newNode, newPath, this, fact, itemDef);
          newFact.set(new Factual(this), item);
          fact.children.push(newFact);
          newFacts.push(newFact);
        }
      }
      return new MaybeVector(newFacts, true);
    }

    fact.set(new Factual(this), value);
    return MaybeVector.of([fact]);
  }
}
