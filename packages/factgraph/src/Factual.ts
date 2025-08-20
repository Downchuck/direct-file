import { Fact } from './Fact';
import { FactDictionary } from './FactDictionary';
import { Path } from './Path';
import { Graph } from './Graph';
import { FactualMeta } from './Fact';
import { InMemoryPersister } from './persisters';
import { compNodeRegistry } from './compnodes/registry';
import { WritableType } from './types';
import { CompNode } from './compnodes/CompNode';

export class Factual {
  private readonly graph: Graph;
  constructor(public readonly factDictionary: FactDictionary) {
    this.graph = new Graph(factDictionary, new InMemoryPersister());
  }

  public getFact(path: string): Fact {
    const p = Path.fromString(path);
    const definition = this.factDictionary.getDefinition(p);
    if (!definition) {
      throw new Error(`Fact not found: ${path}`);
    }
    let value: CompNode;
    if (definition.writable) {
      value = compNodeRegistry.fromWritableConfig(
        definition.writable,
        this.graph
      );
    } else {
      value = compNodeRegistry.fromDerivedConfig(
        definition.derived,
        this.graph
      );
    }

    return new Fact(value, p, [], this.graph, undefined, {} as FactualMeta);
  }

  public save(): void {
    this.graph.save();
  }

  public set(path: string, value: WritableType): void {
    this.graph.set(path, value);
  }

  public get(path: string) {
    return this.graph.get(path);
  }

  public getVect(path: string) {
    return this.graph.getVect(path);
  }
}
