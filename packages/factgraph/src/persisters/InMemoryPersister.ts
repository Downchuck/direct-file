import { Persister } from './Persister';
import { Path } from '../Path';
import { WritableType } from '../types';

export class InMemoryPersister extends Persister {
  private store: Map<string, WritableType> = new Map();

  public getSavedResult<A>(path: Path, klass: any): any {
    return this.store.get(path.toString());
  }

  public setFact(fact: any, value: WritableType): void {
    this.store.set(fact.path.toString(), value);
  }

  public deleteFact(fact: any, deleteSubpaths: boolean = false): void {
    this.store.delete(fact.path.toString());
  }

  public save(): [boolean, any[]] {
    return [true, []];
  }

  public syncWithDictionary(graph: any): any[] {
    return [];
  }
}
