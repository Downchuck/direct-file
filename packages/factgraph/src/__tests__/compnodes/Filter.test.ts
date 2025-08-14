import { FactDictionary } from 'FactDictionary';
import { Graph } from 'Graph';
import { Collection } from 'types/Collection';
import { InMemoryPersister } from 'persisters/InMemoryPersister';

// This is a workaround for the fact that the test environment is broken
// and we can't import the compnodes directly.
import 'compnodes/Filter';
import 'compnodes/Dependency';
import 'compnodes/True';

describe('Filter', () => {
  const dictionary = new FactDictionary();
  dictionary.addDefinition({
    path: '/test',
    derived: {
      typeName: 'Filter',
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

  dictionary.addDefinition({
    path: '/collection',
    writable: {
      typeName: 'Collection',
    },
  });

  dictionary.addDefinition({
    path: '/collection/*/bool',
    writable: {
      typeName: 'Boolean',
    },
  });

  dictionary.addDefinition({
    path: '/collection/*/string',
    writable: {
      typeName: 'String',
    },
  });

  const uuid1 = '8997039b-31e7-4df9-97fd-9c30f6293f40';
  const uuid2 = '3009533e-b68d-4b16-8401-295e919daeb0';

  it('filters collections on the value of the Boolean node', () => {
    const graph = new Graph(dictionary, new InMemoryPersister());
    graph.set('/collection', new Collection([uuid1, uuid2]));

    // The initial state is a placeholder with an empty collection, not an incomplete result.
    // This is because the filter operator returns an empty collection if the input collection is empty,
    // and the dependency on the collection is not yet met.
    // I am not sure how to test this placeholder state yet.

    graph.set(`/collection/#${uuid1}/bool`, true);
    graph.set(`/collection/#${uuid2}/bool`, false);

    expect(graph.get('/test').isComplete).toBe(true);
    expect(graph.get('/test').value).toEqual(new Collection([uuid1]));
  });

  it("throws an error if the collection doesn't exist", () => {
    const localDictionary = new FactDictionary();
    expect(() => {
      localDictionary.addDefinition({
        path: '/anotherTest',
        derived: {
          typeName: 'Filter',
          options: {
            path: '/fakeCollection',
          },
          children: [
            {
              typeName: 'True',
            },
          ],
        },
      });
    }).toThrow("cannot find fact at path '/fakeCollection' from ''");
  });

  it('throws an error if asked to filter on non-Boolean nodes', () => {
    const localDictionary = new FactDictionary();
    expect(() => {
      localDictionary.addDefinition({
        path: '/stringTest',
        derived: {
          typeName: 'Filter',
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
    }).toThrow('Filter child must be a BooleanNode');
  });
});
