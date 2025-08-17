import { CollectionNode } from '../compnodes/CollectionNode';
import { CollectionItemNode } from '../compnodes/CollectionItemNode';
import { CollectionSizeFactory } from '../compnodes/CollectionSize';
import { CollectionSumFactory } from '../compnodes/CollectionSum';
import { IntNode } from '../compnodes/IntNode';
import { DollarNode } from '../compnodes/DollarNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Expression } from '../Expression';
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
    const sizeNode = CollectionSizeFactory.fromDerivedConfig(
      {
        typeName: 'CollectionSize',
        children: [collectionNode],
      },
      factual
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
    factual.set(intCollectionPath, Result.complete(intCollection));
    factual.set(
      intCollectionPath.concat(PathItem.from('a')),
      Result.complete(1)
    );
    factual.set(
      intCollectionPath.concat(PathItem.from('b')),
      Result.complete(2)
    );
    factual.set(
      intCollectionPath.concat(PathItem.from('c')),
      Result.complete(3)
    );

    const getIntExpr = (item: Factual) => {
      const collectionItem = item.get(Path.fromString('/')).get as CollectionItem;
      const itemPath = intCollectionPath.concat(
        PathItem.from(collectionItem.id)
      );
      return new IntNode(Expression.dependency(itemPath)).expr;
    };

    // This is a bit of a hack, as we don't have a real CollectExpression
    const sumNode = CollectionSumFactory.fromDerivedConfig(
      {
        typeName: 'CollectionSum',
        children: [
          new IntNode(
            Expression.thunk(() => {
              const items = intCollection.values.map((item) => {
                const fact = new Factual(new FactDictionary());
                fact.set(Path.fromString('/'), Result.complete(item));
                return getIntExpr(fact).get(factual);
              });
              return Result.complete(items.reduce((a, b) => a.get + b.get, 0));
            })
          ),
        ],
      },
      factual
    );

    expect(sumNode.get(factual).get).toEqual(6);
  });

  it('can extract an item from a collection', () => {
    const itemNode = collectionNode.extract(PathItem.from('a'));
    expect(itemNode).toBeInstanceOf(CollectionItemNode);
    expect((itemNode as CollectionItemNode).get(factual).get).toEqual(
      new CollectionItem('a')
    );
  });
});
