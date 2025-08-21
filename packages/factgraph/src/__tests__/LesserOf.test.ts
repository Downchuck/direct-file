import { LesserOf } from '../compnodes/LesserOf';
import { IntNode } from '../compnodes/IntNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

describe('LesserOf', () => {
  const factual = new Factual(new FactDictionary());

  it('returns the lesser of two integers', () => {
    const node = LesserOf([
      new IntNode(Expression.literal(Result.complete(1))),
      new IntNode(Expression.literal(Result.complete(2))),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(1));
  });
});
