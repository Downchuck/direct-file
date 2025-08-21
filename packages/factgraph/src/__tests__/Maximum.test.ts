import { MaximumFactory } from '../compnodes/Maximum';
import { DependencyNode } from '../compnodes/Dependency';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { IntNode } from '../compnodes/IntNode';
import { Expression } from '../Expression';
import { Result } from '../types';
import { DollarNode } from '../compnodes/DollarNode';
import { Dollar } from '../types/Dollar';
import { DependencyExpression } from '../expressions/DependencyExpression';
import { Path } from '../Path';

import { Graph } from '../Graph';
import { InMemoryPersister } from '../persisters';
import { Collection } from '../types/Collection';

describe('Maximum', () => {
  const dictionary = new FactDictionary();
  dictionary.addDefinition({
    path: '/intTest',
    derived: {
      typeName: 'Maximum',
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
    path: '/dollarTest',
    derived: {
      typeName: 'Maximum',
      children: [
        {
          typeName: 'Dependency',
          options: {
            path: '/collection/*/dollar',
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

  dictionary.addDefinition({
    path: '/collection/*/dollar',
    writable: {
      typeName: 'Dollar',
    },
  });

  const uuid1 = '59a3c760-2fac-45e2-a6cd-0792c4aef83e';
  const uuid2 = '41042a1e-a2a2-459d-9f39-ccaac5612014';
  const uuid3 = 'a3e6c8b0-2f4e-4f3a-8c1d-0792c4aef83e';

  it('finds the maximum of integers', () => {
    const graph = new Graph(dictionary, new InMemoryPersister());
    graph.set('/collection', new Collection([uuid1, uuid2, uuid3]));

    graph.set(`/collection/#${uuid1}/int`, 1);
    graph.set(`/collection/#${uuid2}/int`, 8);
    graph.set(`/collection/#${uuid3}/int`, 5);

    expect(graph.get('/intTest').isComplete).toBe(true);
    expect(graph.get('/intTest').value).toEqual(8);
  });

  it('finds the maximum of dollars', () => {
    const graph = new Graph(dictionary, new InMemoryPersister());
    graph.set('/collection', new Collection([uuid1, uuid2, uuid3]));

    graph.set(`/collection/#${uuid1}/dollar`, Dollar.fromNumber(1.23));
    graph.set(`/collection/#${uuid2}/dollar`, Dollar.fromNumber(8.45));
    graph.set(`/collection/#${uuid3}/dollar`, Dollar.fromNumber(5.67));

    expect(graph.get('/dollarTest').isComplete).toBe(true);
    expect(graph.get('/dollarTest').value.toNumber()).toEqual(8.45);
  });
});
