import { DollarNode } from '../compnodes/DollarNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';
import { Dollar } from '../types/Dollar';

describe('DollarNode', () => {
  const factual = new Factual(new FactDictionary());

  it('can be created with a valid dollar amount', () => {
    const dollar = Dollar.fromNumber(1.23);
    const node = new DollarNode(Expression.literal(dollar));
    expect(node.get(factual)).toEqual(Result.complete(dollar));
  });
});
