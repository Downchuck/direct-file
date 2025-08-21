import { IsCompleteFactory } from '../compnodes/IsComplete';
import { IntNode } from '../compnodes/IntNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

describe('IsComplete', () => {
  const factual = new Factual(new FactDictionary());

  it('returns true if the node is complete', () => {
    const node = new IntNode(Expression.literal(Result.complete(1)));
    const isCompleteNode = IsCompleteFactory.create([node]);
    expect(isCompleteNode.get(factual)).toEqual(Result.complete(true));
  });

  it('returns false if the node is incomplete', () => {
    const node = new IntNode(Expression.literal(Result.incomplete()));
    const isCompleteNode = IsCompleteFactory.create([node]);
    expect(isCompleteNode.get(factual)).toEqual(Result.complete(false));
  });
});
