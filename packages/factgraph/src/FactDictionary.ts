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
    console.log('getting definition', path.toString());
    console.log('definitions', this.definitions);
    return this.definitions.get(path.toString());
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
