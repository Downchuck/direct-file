import { BooleanNode } from '../compnodes/BooleanNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

describe('BooleanNode', () => {
  const factual = new Factual(new FactDictionary());

  it('can be created with a true value', () => {
    const node = new BooleanNode(Expression.literal(Result.complete(true)));
    expect(node.get(factual)).toEqual(Result.complete(true));
  });

  it('can be created with a false value', () => {
    const node = new BooleanNode(Expression.literal(Result.complete(false)));
    expect(node.get(factual)).toEqual(Result.complete(false));
  });
});
