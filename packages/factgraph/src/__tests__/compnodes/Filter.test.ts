import { FactDictionary } from '../../FactDictionary';
import { Graph } from '../../Graph';
import { Collection } from '../../types/Collection';
import { InMemoryPersister } from '../../persisters';
import { Factual } from '../../Factual';

import '../../compnodes';

describe('Filter', () => {
  const uuid1 = '8997039b-31e7-4df9-97fd-9c30f6293f40';
  const uuid2 = '3009533e-b68d-4b16-8401-295e919daeb0';

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

  it('filters collections on the value of the Boolean node', () => {
    dictionary.addDefinition({
      path: '/test',
      derived: {
        typeName: 'Filter',
        options: { path: '/collection' },
        children: [{ typeName: 'Dependency', options: { path: 'bool' } }],
      },
    });

    const factual = new Factual(dictionary);
    factual.graph.persister.facts = graph.persister.facts;

    expect(factual.get('/test').isComplete).toBe(true);
    expect(factual.get('/test').value).toEqual(new Collection([uuid1]));
  });

  it("throws an error if the collection doesn't exist", () => {
    dictionary.addDefinition({
      path: '/anotherTest',
      derived: {
        typeName: 'Filter',
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

  it('throws an error if asked to filter on non-Boolean nodes', () => {
    dictionary.addDefinition({
      path: '/stringTest',
      derived: {
        typeName: 'Filter',
        options: { path: '/collection' },
        children: [{ typeName: 'Dependency', options: { path: 'string' } }],
      },
    });
    const factual = new Factual(dictionary);
    factual.graph.persister.facts = graph.persister.facts;

    // The error is thrown when the graph is evaluated, not when the definition is added.
    expect(() => {
      factual.get('/stringTest');
    }).toThrow('Filter child must be a BooleanNode');
  });
});
