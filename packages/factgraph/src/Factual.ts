import { Fact } from './Fact';
import { FactDictionary } from './FactDictionary';
import { Path } from './Path';
import { Graph } from './Graph';
import { FactualMeta } from './Fact';
import { InMemoryPersister } from './persisters';
import { compNodeRegistry } from './compnodes';
import { WritableType } from './types';

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
    let value;
    if (definition.writable) {
      value = compNodeRegistry.fromDerivedConfig(
        { typeName: definition.writable.typeName },
        this,
        this.factDictionary
      );
    } else {
      value = compNodeRegistry.fromDerivedConfig(
        definition.derived,
        this,
        this.factDictionary
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
}
