import { FactDictionary } from '../../FactDictionary';
import { Graph } from '../../Graph';
import { Collection } from '../../types/Collection';
import { CollectionItem } from '../../types/CollectionItem';
import { InMemoryPersister } from '../../persisters';

// This is a workaround for the fact that the test environment is broken
// and we can't import the compnodes directly.

describe('Find', () => {
  const dictionary = new FactDictionary();
  dictionary.define({
    path: '/test',
    derived: {
      typeName: 'Find',
      options: {
        path: '/collection',
      },
      children: [
        {
          typeName: 'Dependency',
          options: {
            path: 'bool',
          },
        },
      ],
    },
  });

  dictionary.define({
    path: '/collection',
    writable: {
      typeName: 'Collection',
    },
  });

  dictionary.define({
    path: '/collection/*/bool',
    writable: {
      typeName: 'Boolean',
    },
  });

  dictionary.define({
    path: '/collection/*/string',
    writable: {
      typeName: 'String',
    },
  });

  const uuid1 = 'bd54a80b-8d87-4c55-99a1-3bfa514ef613';
  const uuid2 = 'b463129f-b688-4173-a6fc-a5c18c2cbb2d';

  it('finds the collection item with the truthy value', () => {
    const graph = new Graph(dictionary, new InMemoryPersister());
    graph.set('/collection', new Collection([uuid1, uuid2]));

    expect(graph.get('/test').isComplete).toBe(false);

    graph.set(`/collection/#${uuid1}/bool`, true);
    graph.set(`/collection/#${uuid2}/bool`, false);

    expect(graph.get('/test').isComplete).toBe(true);
    expect(graph.get('/test').value).toEqual(new CollectionItem(uuid1, undefined));
  });

  it('finds the first in the collection with the truthy value', () => {
    const graph = new Graph(dictionary, new InMemoryPersister());
    graph.set('/collection', new Collection([uuid1, uuid2]));

    graph.set(`/collection/#${uuid1}/bool`, true);
    graph.set(`/collection/#${uuid2}/bool`, true);

    expect(graph.get('/test').isComplete).toBe(true);
    expect(graph.get('/test').value).toEqual(new CollectionItem(uuid1, undefined));
  });

  it("throws an error if the collection doesn't exist", () => {
    const localDictionary = new FactDictionary();
    expect(() => {
      localDictionary.define({
        path: '/anotherTest',
        derived: {
          typeName: 'Find',
          options: {
            path: '/fakeCollection',
          },
          children: [],
        },
      });
    }).toThrow("cannot find fact at path '/fakeCollection' from ''");
  });

  it('throws an error if asked to find on non-Boolean nodes', () => {
    const localDictionary = new FactDictionary();
    expect(() => {
      localDictionary.define({
        path: '/stringTest',
        derived: {
          typeName: 'Find',
          options: {
            path: '/collection',
          },
          children: [
            {
              typeName: 'Dependency',
              options: {
                path: 'string',
              },
            },
          ],
        },
      });
    }).toThrow('Find child must be a BooleanNode');
  });
});
