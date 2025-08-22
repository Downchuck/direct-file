import { Graph } from '../Graph';
import { FactDictionary } from '../FactDictionary';
import { Collection } from '../types/Collection';
import { Result } from '../types';
import { InMemoryPersister } from '../persisters';
import '../compnodes/register-factories';

describe('Simple Collection tests', () => {
  const dictionary = new FactDictionary();
  dictionary.addDefinition({
    path: '/mySimpleCollection',
    writable: {
      typeName: 'Collection',
    },
  });

  it('can set and get a collection', () => {
    const graph = new Graph(dictionary, new InMemoryPersister());
    const collection = new Collection(['a', 'b', 'c']);
    graph.set('/mySimpleCollection', collection);
    const retrieved = graph.get('/mySimpleCollection');
    expect(retrieved).toEqual(Result.complete(collection));
  });
});
