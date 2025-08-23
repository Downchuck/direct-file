import { FilterFactory } from '../../compnodes/Filter';
import { Factual } from '../../Factual';
import { FactDictionary } from '../../FactDictionary';
import { Collection } from '../../types/Collection';
import { Result } from '../../types';
import { Graph } from '../../Graph';
import { compNodeRegistry } from '../../compnodes/registry';
import { Path } from '../../Path';
import { InMemoryPersister } from '../../persisters';

describe('Filter', () => {
  it('filters collections on the value of the Boolean node', () => {
    const factDictionary = new FactDictionary();
    factDictionary.addDefinition({
      path: '/collection',
      writable: { typeName: 'Collection' },
    });
    factDictionary.addDefinition({
      path: '/collection/*/bool',
      writable: { typeName: 'Boolean' },
    });
    factDictionary.addDefinition({
      path: '/filtered',
      derived: {
        typeName: 'Filter',
        options: { path: '/collection' },
        children: [
          {
            typeName: 'Boolean',
            children: [
              {
                typeName: 'Dependency',
                options: { path: 'bool' },
              },
            ],
          },
        ],
      },
    });

    const factual = new Factual(factDictionary);
    const graph = new Graph(factDictionary, new InMemoryPersister());
    graph.set('/collection', new Collection(['#1', '#2']));
    graph.set('/collection/#1/bool', true);
    graph.set('/collection/#2/bool', false);

    const filteredNode = compNodeRegistry.fromDerivedConfig(
      factDictionary.getDefinition(Path.fromString('/filtered')).derived,
      graph
    );

    expect(filteredNode.get(factual)).toEqual(
      Result.complete(new Collection(['#1']))
    );
  });
});
