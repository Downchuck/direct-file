import { FirstNCollectionItemsFactory } from '../compnodes/FirstNCollectionItems';
import { CollectionNode } from '../compnodes/CollectionNode';
import { IntNode } from '../compnodes/IntNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';
import { Collection } from '../types/Collection';

describe('FirstNCollectionItems', () => {
  const factual = new Factual(new FactDictionary());

  it('returns the first N items from a collection', () => {
    const items = ['a', 'b', 'c'];
    const collection = new Collection(items);
    const collectionNode = new CollectionNode(
      Expression.literal(Result.complete(collection)),
      undefined
    );
    const nNode = new IntNode(Expression.literal(Result.complete(2)));
    const node = FirstNCollectionItemsFactory.create([collectionNode, nNode]);
    const result = node.get(factual);
    const expected = new Collection(['a', 'b']);
    expect(result).toEqual(Result.complete(expected));
  });
});
