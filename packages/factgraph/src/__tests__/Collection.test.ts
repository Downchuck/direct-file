import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types';

describe('Collection tests', () => {
  it('can get the size of a collection', () => {
    const dictionary = new FactDictionary();
    dictionary.addDefinition({
      path: '/myCollection',
      writable: { typeName: 'Collection' },
    });
    dictionary.addDefinition({
      path: '/myCollection/size',
      derived: {
        typeName: 'CollectionSize',
        children: [['/myCollection']],
      },
    });
    dictionary.addDefinition({
        path: '/myCollection/*',
        writable: { typeName: 'String' },
    });

    const graph = new Graph(dictionary);
    graph.set('/myCollection', ['a', 'b', 'c']);
    expect(graph.get('/myCollection/size')).toEqual(Result.complete(3));
  });
});
