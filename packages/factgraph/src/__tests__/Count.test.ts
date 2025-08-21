import '../compnodes';
import { CountFactory } from '../compnodes/Count';
import { DependencyNode } from '../compnodes/Dependency';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { InMemoryPersister } from '../persisters';
import { Collection } from '../types/Collection';
import { Result } from '../types';
import { DependencyExpression } from '../expressions/DependencyExpression';
import { Path } from '../Path';

describe('Count', () => {
  const dictionary = new FactDictionary();
  dictionary.addDefinition({
    path: '/count',
    derived: {
      typeName: 'Count',
      children: [
        {
          typeName: 'Dependency',
          options: {
            path: '/collection/*/bool',
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

  it('counts the number of true values in a collection', () => {
    const graph = new Graph(dictionary, new InMemoryPersister());
    const factual = new Factual(dictionary);
    graph.set('/collection', new Collection(['1', '2', '3', '4', '5']));
    graph.set('/collection/#1/bool', true);
    graph.set('/collection/#2/bool', false);
    graph.set('/collection/#3/bool', true);
    graph.set('/collection/#4/bool', true);
    graph.set('/collection/#5/bool', false);
    expect(graph.get('/count')).toEqual(Result.complete(3));
  });

  it('returns 0 for an empty collection', () => {
    const graph = new Graph(dictionary, new InMemoryPersister());
    const factual = new Factual(dictionary);
    graph.set('/collection', new Collection([]));
    expect(graph.get('/count')).toEqual(Result.complete(0));
  });

  it('returns 0 for a collection of all false values', () => {
    const graph = new Graph(dictionary, new InMemoryPersister());
    const factual = new Factual(dictionary);
    graph.set('/collection', new Collection(['1', '2', '3']));
    graph.set('/collection/#1/bool', false);
    graph.set('/collection/#2/bool', false);
    graph.set('/collection/#3/bool', false);
    expect(graph.get('/count')).toEqual(Result.complete(0));
  });
});
