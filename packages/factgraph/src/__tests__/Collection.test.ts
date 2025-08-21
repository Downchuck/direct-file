import { CollectionNode } from '../compnodes/CollectionNode';
import { CollectionItemNode } from '../compnodes/CollectionItemNode';
import { CollectionSizeFactory } from '../compnodes/CollectionSize';
import { CollectionSumFactory } from '../compnodes/CollectionSum';
import { IntNode } from '../compnodes/IntNode';
import { DollarNode } from '../compnodes/DollarNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Expression } from '../Expression';
import { Result } from '../types';
import { Collection } from '../types/Collection';
import { CollectionItem } from '../types/CollectionItem';
import { Dollar } from '../types/Dollar';
import { Path } from '../Path';
import { PathItem } from '../PathItem';

import '../compnodes/register-factories';
import { Graph } from '../Graph';
import { InMemoryPersister } from '../persisters';

describe('Collection tests', () => {
  const dictionary = new FactDictionary();
  dictionary.addDefinition({
    path: '/myCollection',
    writable: {
      typeName: 'Collection',
    },
  });
  dictionary.addDefinition({
    path: '/myCollection/size',
    derived: {
      typeName: 'CollectionSize',
      children: [
        {
          typeName: 'Dependency',
          options: {
            path: '/myCollection',
          },
        },
      ],
    },
  });

  it('can get the size of a collection', () => {
    const graph = new Graph(dictionary, new InMemoryPersister());
    const collection = new Collection([
      new CollectionItem('a'),
      new CollectionItem('b'),
      new CollectionItem('c'),
    ]);
    graph.set('/myCollection', collection);
    expect(graph.get('/myCollection/size')).toEqual(Result.complete(3));
  });
});
