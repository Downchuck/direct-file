import { IntNode } from '../compnodes/IntNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

describe('IntNode', () => {
  const factual = new Factual(new FactDictionary());

  it('can be created with a valid integer', () => {
    const node = new IntNode(Expression.literal(1));
    expect(node.get(factual)).toEqual(Result.complete(1));
  });
});
