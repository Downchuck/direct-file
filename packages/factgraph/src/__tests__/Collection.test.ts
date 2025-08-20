import '../compnodes';
import { CollectionNode } from '../compnodes/CollectionNode';
import { CollectionItemNode } from '../compnodes/CollectionItemNode';
import { compNodeRegistry } from '../compnodes/registry';
import { IntNode } from '../compnodes/IntNode';
import { DollarNode } from '../compnodes/DollarNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Expression } from '../Expression';
import { DependencyExpression } from '../expressions/DependencyExpression';
import { Result } from '../types';
import { Collection } from '../types/Collection';
import { CollectionItem } from '../types/CollectionItem';
import { Dollar } from '../types/Dollar';
import { Path } from '../Path';
import { PathItem } from '../PathItem';

describe('Collection tests', () => {
  const factual = new Factual(new FactDictionary());

  const collectionPath = Path.fromString('/myCollection');
  const collection = new Collection([
    new CollectionItem('a'),
    new CollectionItem('b'),
    new CollectionItem('c'),
  ]);

  factual.set(collectionPath, Result.complete(collection));

  const collectionNode = new CollectionNode(
    Expression.literal(Result.complete(collection))
  );

  it('can get the size of a collection', () => {
    const sizeNode = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'CollectionSize',
        children: [collectionNode],
      },
      factual.graph
    );
    expect(sizeNode.get(factual)).toEqual(Result.complete(3));
  });

  it('can sum a collection of integers', () => {
    const intCollection = new Collection([
      new CollectionItem('a'),
      new CollectionItem('b'),
      new CollectionItem('c'),
    ]);
    const intCollectionPath = Path.fromString('/intCollection');
    factual.factDictionary.addDefinition({
      path: '/intCollection',
      writable: {
        typeName: 'Collection',
      },
    });
    factual.set(intCollectionPath, intCollection);
    factual.factDictionary.addDefinition({
      path: '/intCollection/*',
      writable: {
        typeName: 'Int',
      },
    });
    factual.set(new Path([PathItem.fromString('intCollection'), PathItem.fromString('#a')]), 1);
    factual.set(new Path([PathItem.fromString('intCollection'), PathItem.fromString('#b')]), 2);
    factual.set(new Path([PathItem.fromString('intCollection'), PathItem.fromString('#c')]), 3);

    const sumNode = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'CollectionSum',
        children: [
          {
            typeName: 'Dependency',
            options: { path: '/intCollection/*' },
          },
        ],
      },
      factual.graph
    );

    expect(sumNode.get(factual).get).toEqual(6);
  });

  it('can extract an item from a collection', () => {
    const itemNode = collectionNode.extract(PathItem.fromString('#a'));
    expect(itemNode).toBeInstanceOf(CollectionItemNode);
    expect((itemNode as CollectionItemNode).get(factual).get).toEqual(
      new CollectionItem('#a')
    );
  });
});
