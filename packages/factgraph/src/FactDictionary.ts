import { Path } from './Path';
import {
  allFactories,
  DerivedNodeFactory,
  WritableNodeFactory,
} from './compnodes';

export class FactDefinition {
  public readonly path: Path;
  public readonly derived?: any;
  public readonly writable?: any;

  constructor(config: { path: string | Path; derived?: any; writable?: any }) {
    this.path =
      typeof config.path === 'string'
        ? Path.fromString(config.path)
        : config.path;
    this.derived = config.derived;
    this.writable = config.writable;
  }
}

export class FactDictionary {
  private readonly definitions = new Map<string, FactDefinition>();
  private frozen = false;
  public readonly factories: Map<
    string,
    DerivedNodeFactory | WritableNodeFactory
  >;

  constructor() {
    this.factories = new Map(allFactories.map((f) => [f.typeName, f]));
    this.define({
      path: '/',
      derived: { typeName: 'Root' },
    });
  }

  public define(definitionConfig: any): void {
    if (this.frozen) {
      throw new Error('Cannot add definitions to a frozen dictionary');
    }
    const definition = new FactDefinition(definitionConfig);
    this.definitions.set(definition.path.toString(), definition);
  }

  public getDefinition(path: Path): FactDefinition | undefined {
    const exactMatch = this.definitions.get(path.toString());
    if (exactMatch) {
      return exactMatch;
    }

    // Find the best wildcard match
    let bestMatch: FactDefinition | undefined = undefined;
    let bestMatchWildcardCount = Number.MAX_SAFE_INTEGER;

    for (const definition of this.definitions.values()) {
      const defPath = definition.path;
      if (
        defPath.absolute !== path.absolute ||
        defPath.items.length !== path.items.length
      ) {
        continue;
      }

      let isMatch = true;
      let wildcardCount = 0;
      for (let i = 0; i < defPath.items.length; i++) {
        const defItem = defPath.items[i];
        const pathItem = path.items[i];

        if (defItem.isWildcard) {
          wildcardCount++;
          continue;
        }

        if (!defItem.equals(pathItem)) {
          isMatch = false;
          break;
        }
      }

      if (isMatch) {
        if (wildcardCount < bestMatchWildcardCount) {
          bestMatch = definition;
          bestMatchWildcardCount = wildcardCount;
        }
      }
    }

    return bestMatch;
  }

  public freeze(): void {
    this.frozen = true;
  }
}
