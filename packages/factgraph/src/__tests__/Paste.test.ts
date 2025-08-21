import { PasteFactory } from '../compnodes/Paste';
import { StringNode } from '../compnodes/StringNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

describe('Paste', () => {
  const factual = new Factual(new FactDictionary());

  it('pastes two strings', () => {
    const node = PasteFactory.create([
      new StringNode(Expression.literal(Result.complete('a'))),
      new StringNode(Expression.literal(Result.complete('b'))),
    ]);
    expect(node.get(factual)).toEqual(Result.complete('ab'));
  });
});
