import { FactDictionary } from '../../FactDictionary';
import { Graph } from '../../Graph';
import { Collection } from '../../types/Collection';
import { CollectionItem } from '../../types/CollectionItem';
import { InMemoryPersister } from '../../persisters';
import { Factual } from '../../Factual';

import '../../compnodes';

describe('Find', () => {
  const uuid1 = 'bd54a80b-8d87-4c55-99a1-3bfa514ef613';
  const uuid2 = 'b463129f-b688-4173-a6fc-a5c18c2cbb2d';

  let dictionary: FactDictionary;
  let graph: Graph;

  beforeEach(() => {
    dictionary = new FactDictionary();
    dictionary.addDefinition({
      path: '/collection',
      writable: { typeName: 'Collection' },
    });
    dictionary.addDefinition({
      path: '/collection/*/bool',
      writable: { typeName: 'Boolean' },
    });
    dictionary.addDefinition({
      path: '/collection/*/string',
      writable: { typeName: 'String' },
    });

    graph = new Graph(dictionary, new InMemoryPersister());
    graph.set('/collection', new Collection([uuid1, uuid2]));
    graph.set(`/collection/#${uuid1}/bool`, true);
    graph.set(`/collection/#${uuid2}/bool`, false);
    graph.set(`/collection/#${uuid1}/string`, 'hello');
    graph.set(`/collection/#${uuid2}/string`, 'world');
  });

  it('finds the collection item with the truthy value', () => {
    dictionary.addDefinition({
      path: '/test',
      derived: {
        typeName: 'Find',
        options: { path: '/collection' },
        children: [{ typeName: 'Dependency', options: { path: 'bool' } }],
      },
    });

    const factual = new Factual(dictionary);
    factual.graph.persister.facts = graph.persister.facts;

    expect(factual.get('/test').isComplete).toBe(true);
    expect(factual.get('/test').value).toEqual(new CollectionItem(uuid1));
  });

  it('finds the first in the collection with the truthy value', () => {
    dictionary.addDefinition({
        path: '/test',
        derived: {
          typeName: 'Find',
          options: { path: '/collection' },
          children: [{ typeName: 'Dependency', options: { path: 'bool' } }],
        },
      });
    const factual = new Factual(dictionary);
    factual.graph.persister.facts = graph.persister.facts;

    // Set both to true to ensure it finds the first one
    factual.set(`/collection/#${uuid1}/bool`, true);
    factual.set(`/collection/#${uuid2}/bool`, true);

    expect(factual.get('/test').isComplete).toBe(true);
    expect(factual.get('/test').value).toEqual(new CollectionItem(uuid1));
  });

  it("throws an error if the collection doesn't exist", () => {
    dictionary.addDefinition({
      path: '/anotherTest',
      derived: {
        typeName: 'Find',
        options: { path: '/fakeCollection' },
        children: [{ typeName: 'True' }],
      },
    });
    const factual = new Factual(dictionary);
    factual.graph.persister.facts = graph.persister.facts;

    expect(() => {
      factual.get('/anotherTest');
    }).toThrow("cannot find fact at path '/fakeCollection' from ''");
  });

  it('throws an error if asked to find on non-Boolean nodes', () => {
    dictionary.addDefinition({
      path: '/stringTest',
      derived: {
        typeName: 'Find',
        options: { path: '/collection' },
        children: [{ typeName: 'Dependency', options: { path: 'string' } }],
      },
    });
    const factual = new Factual(dictionary);
    factual.graph.persister.facts = graph.persister.facts;

    expect(() => {
      factual.get('/stringTest');
    }).toThrow('Find child must be a BooleanNode');
  });
});
