import { EqualFactory } from '../compnodes/Equal';
import { IntNode } from '../compnodes/IntNode';
import { StringNode } from '../compnodes/StringNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';
import { Expression } from '../Expression';

describe('Equal', () => {
  const factual = new Factual(new FactDictionary());

  it('returns false if the inputs are different', () => {
    const node = EqualFactory.create([
      new IntNode(Expression.literal(Result.complete(1))),
      new IntNode(Expression.literal(Result.complete(2))),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(false));
  });

  it('returns true if the inputs are the same', () => {
    const node = EqualFactory.create([
      new StringNode(Expression.literal(Result.complete('Test'))),
      new StringNode(Expression.literal(Result.complete('Test'))),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(true));
  });
});
