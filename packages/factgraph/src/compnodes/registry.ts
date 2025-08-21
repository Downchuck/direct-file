import { Graph } from '../Graph';
import { CompNode, DerivedNodeFactory, WritableNodeFactory } from './CompNode';

export type CompNodeFactory = DerivedNodeFactory | WritableNodeFactory;

class CompNodeRegistry {
  private factories = new Map<string, CompNodeFactory>();

  public register(factory: CompNodeFactory) {
    console.log('registering', factory.typeName);
    this.factories.set(factory.typeName, factory);
  }

  public fromDerivedConfig(e: any, graph: Graph): CompNode {
    const factory = this.factories.get(e.typeName) as DerivedNodeFactory;
    if (!factory || !factory.fromDerivedConfig) {
      throw new Error(`${e.typeName} is not a registered DerivedNode`);
    }
    return factory.fromDerivedConfig(e, graph);
  }

  public fromWritableConfig(e: any, graph: Graph): CompNode {
    const factory = this.factories.get(e.typeName) as WritableNodeFactory;
    if (!factory || !factory.fromWritableConfig) {
      throw new Error(`${e.typeName} is not a registered WritableNode`);
    }
    return factory.fromWritableConfig(e, graph);
  }
}

export const compNodeRegistry = new CompNodeRegistry();
