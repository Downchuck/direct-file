import { MaximumFactory, IntNode, DollarNode } from '../compnodes';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';
import { Dollar } from '../types/Dollar';

describe('Maximum', () => {
  const factual = new Factual(new FactDictionary());
  const factory = new MaximumFactory();

  it('finds the maximum of integers', () => {
    const node = new IntNode(
      Expression.literal(Result.complete([1, 5, 2, 8, 3]))
    );
    const maxNode = factory.create(node);
    expect(maxNode.get(factual)).toEqual(Result.complete(8));
  });

  it('finds the maximum of dollars', () => {
    const node = new DollarNode(
      Expression.literal(
        Result.complete([1, 5, 2, 8, 3].map((n) => Dollar.fromNumber(n)))
      )
    );
    const maxNode = factory.create(node);
    expect(maxNode.get(factual).get.toNumber()).toEqual(8);
  });
});
