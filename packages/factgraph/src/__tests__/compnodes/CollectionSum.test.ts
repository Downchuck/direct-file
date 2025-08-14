import { FactDictionary } from '../../FactDictionary';
import { Graph } from '../../Graph';
import { Collection } from '../../types/Collection';
import { Dollar } from '../../types/Dollar';
import { Rational } from '../../types/Rational';
import { InMemoryPersister } from '../../persisters';

// This is a workaround for the fact that the test environment is broken
// and we can't import the compnodes directly.
import '../../compnodes/CollectionSum';
import '../../compnodes/Dependency';

describe('CollectionSum', () => {
  const dictionary = new FactDictionary();
  dictionary.addDefinition({
    path: '/intTest',
    derived: {
      typeName: 'CollectionSum',
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
    path: '/rationalTest',
    derived: {
      typeName: 'CollectionSum',
      children: [
        {
          typeName: 'Dependency',
          options: {
            path: '/collection/*/rational',
          },
        },
      ],
    },
  });

  dictionary.addDefinition({
    path: '/dollarTest',
    derived: {
      typeName: 'CollectionSum',
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
    path: '/collection/*/rational',
    writable: {
      typeName: 'Rational',
    },
  });

  dictionary.addDefinition({
    path: '/collection/*/dollar',
    writable: {
      typeName: 'Dollar',
    },
  });

  dictionary.addDefinition({
    path: '/collection/*/string',
    writable: {
      typeName: 'String',
    },
  });

  const uuid1 = '59a3c760-2fac-45e2-a6cd-0792c4aef83e';
  const uuid2 = '41042a1e-a2a2-459d-9f39-ccaac5612014';

  it('sums Ints', () => {
    const graph = new Graph(dictionary, new InMemoryPersister());
    graph.set('/collection', new Collection([uuid1, uuid2]));

    expect(graph.get('/intTest').isComplete).toBe(false);

    graph.set(`/collection/#${uuid1}/int`, 1);
    graph.set(`/collection/#${uuid2}/int`, 2);

    expect(graph.get('/intTest').isComplete).toBe(true);
    expect(graph.get('/intTest').value).toEqual(3);
  });

  it('sums Rationals', () => {
    const graph = new Graph(dictionary, new InMemoryPersister());
    graph.set('/collection', new Collection([uuid1, uuid2]));

    expect(graph.get('/rationalTest').isComplete).toBe(false);

    graph.set(`/collection/#${uuid1}/rational`, new Rational(1, 2));
    graph.set(`/collection/#${uuid2}/rational`, new Rational(1, 3));

    expect(graph.get('/rationalTest').isComplete).toBe(true);
    expect(graph.get('/rationalTest').value).toEqual(new Rational(5, 6));
  });

  it('sums Dollars', () => {
    const graph = new Graph(dictionary, new InMemoryPersister());
    graph.set('/collection', new Collection([uuid1, uuid2]));

    expect(graph.get('/dollarTest').isComplete).toBe(false);

    graph.set(`/collection/#${uuid1}/dollar`, Dollar.fromNumber(1.23));
    graph.set(`/collection/#${uuid2}/dollar`, Dollar.fromNumber(4.56));

    expect(graph.get('/dollarTest').isComplete).toBe(true);
    expect(graph.get('/dollarTest').value).toEqual(Dollar.fromNumber(5.79));
  });

  it('throws an error if asked to sum non-numeric nodes', () => {
    const localDictionary = new FactDictionary();
    localDictionary.addDefinition({
        path: '/stringTest',
        derived: {
          typeName: 'CollectionSum',
          children: [
            {
              typeName: 'Dependency',
              options: {
                path: '/collection/*/string',
              },
            },
          ],
        },
      });
    const graph = new Graph(localDictionary, new InMemoryPersister());
    graph.set('/collection', new Collection([uuid1, uuid2]));
    graph.set(`/collection/#${uuid1}/string`, "hello");
    expect(() => graph.get('/stringTest')).toThrow('cannot sum a StringNode');
  });
});
