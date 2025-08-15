import { Path } from './Path';

export class FactDictionary {
  private readonly definitions = new Map<string, any>();
  private frozen = false;
  private meta: any = { version: 'Invalid' };

  constructor() {
    this.addDefinition({
      path: '/',
      derived: { typeName: 'Root' },
    });
  }

  public addDefinition(definition: any): void {
    if (this.frozen) {
      throw new Error('Cannot add definitions to a frozen dictionary');
    }
    console.log('adding definition', definition);
    this.definitions.set(definition.path, definition);
  }

  public getDefinition(path: Path): any {
    console.log('getDefinition for:', path.toString());
    const exactMatch = this.definitions.get(path.toString());
    if (exactMatch) {
      return exactMatch;
    }

    for (const [pathString, definition] of this.definitions.entries()) {
      const definitionPath = Path.fromString(pathString);
      if (definitionPath.items.length === path.items.length) {
        let match = true;
        for (let i = 0; i < path.items.length; i++) {
          const defItem = definitionPath.items[i];
          const pathItem = path.items[i];
          if (defItem.isWildcard) {
            continue;
          }
          if (defItem.key !== pathItem.key) {
            match = false;
            break;
          }
        }
        if (match) {
          return definition;
        }
      }
    }

    return undefined;
  }

  public freeze(): void {
    this.frozen = true;
  }

  public addMeta(meta: any): void {
    if (this.frozen) {
      throw new Error('Cannot add meta to a frozen dictionary');
    }
    this.meta = meta;
  }

  public getMeta(): any {
    return this.meta;
  }
}
