import { Graph } from '../Graph';
import { CompNode, DerivedNodeFactory, WritableNodeFactory } from './CompNode';

export type CompNodeFactory = DerivedNodeFactory | WritableNodeFactory;

class CompNodeRegistry {
  private factoryClasses = new Map<string, any>();
  private factoryInstances = new Map<string, CompNodeFactory>();

  public register(typeName: string, factoryClass: any) {
    this.factoryClasses.set(typeName, factoryClass);
  }

  private getFactory(typeName: string): CompNodeFactory {
    let instance = this.factoryInstances.get(typeName);
    if (!instance) {
      const FactoryClass = this.factoryClasses.get(typeName);
      if (!FactoryClass) {
        throw new Error(`${typeName} is not a registered node`);
      }
      instance = new FactoryClass();
      this.factoryInstances.set(typeName, instance);
    }
    return instance;
  }

  public fromDerivedConfig(e: any, graph: Graph): CompNode {
    const factory = this.getFactory(e.typeName) as DerivedNodeFactory;
    if (!factory.fromDerivedConfig) {
      throw new Error(`${e.typeName} is not a registered DerivedNode`);
    }
    return factory.fromDerivedConfig(e, graph);
  }

  public fromWritableConfig(e: any, graph: Graph): CompNode {
    const factory = this.getFactory(e.typeName) as WritableNodeFactory;
    if (!factory.fromWritableConfig) {
      throw new Error(`${e.typeName} is not a registered WritableNode`);
    }
    return factory.fromWritableConfig(e, graph);
  }
}

export const compNodeRegistry = new CompNodeRegistry();
