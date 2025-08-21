import { MinimumFactory } from '../compnodes/Minimum';
import { DependencyNode } from '../compnodes/Dependency';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { IntNode } from '../compnodes/IntNode';
import { Expression } from '../Expression';
import { Result } from '../types';
import { DependencyExpression } from '../expressions/DependencyExpression';
import { Path } from '../Path';

import { Graph } from '../Graph';
import { InMemoryPersister } from '../persisters';
import { Collection } from '../types/Collection';

describe('Minimum', () => {
  const dictionary = new FactDictionary();
  dictionary.addDefinition({
    path: '/intTest',
    derived: {
      typeName: 'Minimum',
      children: [
        {
          typeName: 'Dependency',
          options: {
            path: '/collection/*/int',
          },
        },
      ],
    },
  });

  dictionary.addDefinition({
    path: '/collection',
    writable: {
      typeName: 'Collection',
    },
  });

  dictionary.addDefinition({
    path: '/collection/*/int',
    writable: {
      typeName: 'Int',
    },
  });

  const uuid1 = '59a3c760-2fac-45e2-a6cd-0792c4aef83e';
  const uuid2 = '41042a1e-a2a2-459d-9f39-ccaac5612014';
  const uuid3 = 'a3e6c8b0-2f4e-4f3a-8c1d-0792c4aef83e';

  it('finds the minimum of integers', () => {
    const graph = new Graph(dictionary, new InMemoryPersister());
    graph.set('/collection', new Collection([uuid1, uuid2, uuid3]));

    graph.set(`/collection/#${uuid1}/int`, 1);
    graph.set(`/collection/#${uuid2}/int`, 8);
    graph.set(`/collection/#${uuid3}/int`, 5);

    expect(graph.get('/intTest').isComplete).toBe(true);
    expect(graph.get('/intTest').value).toEqual(1);
  });
});
