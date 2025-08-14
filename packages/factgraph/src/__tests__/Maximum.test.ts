import { MaximumFactory } from '../compnodes';
import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Collection } from '../types/Collection';
import { Dollar } from '../types/Dollar';
import { InMemoryPersister } from '../persisters';

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
