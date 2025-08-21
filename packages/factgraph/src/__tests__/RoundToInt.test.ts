import { RoundToIntFactory } from '../compnodes/RoundToInt';
import { DollarNode } from '../compnodes/DollarNode';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';
import { Dollar } from '../types/Dollar';

describe('RoundToInt', () => {
  const factual = new Factual(new FactDictionary());

  it('rounds a dollar amount to the nearest integer', () => {
    const node = RoundToIntFactory.create([
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(2.5)))
      ),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(3));
  });
});
