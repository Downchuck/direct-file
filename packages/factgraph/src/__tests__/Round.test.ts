import { RoundFactory } from '../compnodes/Round';
import { DollarNode } from '../compnodes/DollarNode';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';
import { Dollar } from '../types/Dollar';

describe('Round', () => {
  const factual = new Factual(new FactDictionary());

  it('rounds a dollar amount', () => {
    const node = RoundFactory.create([
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(2.5)))
      ),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(Dollar.fromNumber(3))
    );
  });
});
