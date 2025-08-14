import { RoundToIntFactory, DollarNode } from '../compnodes';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';
import { Dollar } from '../types/Dollar';

describe('RoundToInt', () => {
  const factual = new Factual(new FactDictionary());
  const factory = new RoundToIntFactory();

  it('rounds a dollar value up to the nearest integer', () => {
    const node = new DollarNode(
      Expression.literal(Result.complete(Dollar.fromNumber(5.7)))
    );
    const roundNode = factory.create(node);
    expect(roundNode.get(factual)).toEqual(Result.complete(6));
  });

  it('rounds a dollar value down to the nearest integer', () => {
    const node = new DollarNode(
      Expression.literal(Result.complete(Dollar.fromNumber(5.3)))
    );
    const roundNode = factory.create(node);
    expect(roundNode.get(factual)).toEqual(Result.complete(5));
  });

  it('rounds a dollar value at .5 up to the nearest integer', () => {
    const node = new DollarNode(
      Expression.literal(Result.complete(Dollar.fromNumber(5.5)))
    );
    const roundNode = factory.create(node);
    expect(roundNode.get(factual)).toEqual(Result.complete(6));
  });
});
