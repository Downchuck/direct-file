import { CollectionNode } from '../compnodes/CollectionNode';
import { IntNode } from '../compnodes/IntNode';
import { Expression } from '../Expression';
import { Collection } from '../types/Collection';
import { Result } from '../types/Result';
import { v4 as uuidv4 } from 'uuid';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { CollectionSizeFactory } from '../compnodes/CollectionSize';

describe('CollectionSize', () => {
  const factual = new Factual(new FactDictionary());
  const factory = new CollectionSizeFactory();

  it('calculates the size of a collection', () => {
    const items = [uuidv4(), uuidv4(), uuidv4()];
    const collection = new Collection(items);
    const collectionNode = new CollectionNode(
      Expression.literal(Result.complete(collection)),
      undefined
    );

    const sizeNode = factory.create!([collectionNode]) as IntNode;
    const result = sizeNode.get(factual);

    expect(result.isComplete).toBe(true);
    expect(result.get).toBe(3);
  });

  it('returns 0 for an empty collection', () => {
    const collection = new Collection([]);
    const collectionNode = new CollectionNode(
      Expression.literal(Result.complete(collection)),
      undefined
    );

    const sizeNode = factory.create!([collectionNode]) as IntNode;
    const result = sizeNode.get(factual);

    expect(result.isComplete).toBe(true);
    expect(result.get).toBe(0);
  });

  it('returns incomplete for an incomplete collection', () => {
    const collectionNode = new CollectionNode(
      Expression.literal(Result.incomplete()),
      undefined
    );

    const sizeNode = factory.create!([collectionNode]) as IntNode;
    const result = sizeNode.get(factual);

    expect(result.isComplete).toBe(false);
  });
});
