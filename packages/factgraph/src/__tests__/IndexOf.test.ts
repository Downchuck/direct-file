import { IndexOfFactory } from '../compnodes/IndexOf';
import { CollectionNode } from '../compnodes/CollectionNode';
import { StringNode } from '../compnodes/StringNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';
import { Collection } from '../types/Collection';

describe('IndexOf', () => {
  const factual = new Factual(new FactDictionary());

  it('returns the index of an item in a collection', () => {
    const items = ['a', 'b', 'c'];
    const collection = new Collection(items);
    const collectionNode = new CollectionNode(
      Expression.literal(Result.complete(collection)),
      undefined
    );
    const itemNode = new StringNode(Expression.literal(Result.complete('b')));
    const node = IndexOfFactory.create([collectionNode, itemNode]);
    const result = node.get(factual);
    expect(result).toEqual(Result.complete(1));
  });

  it('returns -1 if the item is not in the collection', () => {
    const items = ['a', 'b', 'c'];
    const collection = new Collection(items);
    const collectionNode = new CollectionNode(
      Expression.literal(Result.complete(collection)),
      undefined
    );
    const itemNode = new StringNode(Expression.literal(Result.complete('d')));
    const node = IndexOfFactory.create([collectionNode, itemNode]);
    const result = node.get(factual);
    expect(result).toEqual(Result.complete(-1));
  });
});
