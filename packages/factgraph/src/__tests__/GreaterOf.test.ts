import { GreaterOf } from '../compnodes/GreaterOf';
import { IntNode } from '../compnodes/IntNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

describe('GreaterOf', () => {
  const factual = new Factual(new FactDictionary());

  it('returns the greater of two integers', () => {
    const node = GreaterOf([
      new IntNode(Expression.literal(Result.complete(1))),
      new IntNode(Expression.literal(Result.complete(2))),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(2));
  });
});
