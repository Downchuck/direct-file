import { AsDecimalStringFactory, RationalNode } from '../compnodes';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';
import { Rational } from '../types/Rational';

describe('AsDecimalString', () => {
  const factual = new Factual(new FactDictionary());
  const factory = new AsDecimalStringFactory();

  it('converts a rational to a decimal string with default scale', () => {
    const node = new RationalNode(
      Expression.literal(Result.complete(new Rational(1, 3)))
    );
    const asDecimalStringNode = factory.create(node, 2);
    expect(asDecimalStringNode.get(factual)).toEqual(Result.complete('0.33'));
  });

  it('converts a rational to a decimal string with specified scale', () => {
    const node = new RationalNode(
      Expression.literal(Result.complete(new Rational(1, 3)))
    );
    const asDecimalStringNode = factory.create(node, 4);
    expect(asDecimalStringNode.get(factual)).toEqual(Result.complete('0.3333'));
  });

  it('rounds up correctly', () => {
    const node = new RationalNode(
      Expression.literal(Result.complete(new Rational(2, 3)))
    );
    const asDecimalStringNode = factory.create(node, 2);
    expect(asDecimalStringNode.get(factual)).toEqual(Result.complete('0.67'));
  });
});
