import { AsDecimalStringFactory } from '../compnodes/AsDecimalString';
import { RationalNode } from '../compnodes/RationalNode';
import { Result } from '../types/Result';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';
import { Rational } from '../types/Rational';

describe('AsDecimalString', () => {
  const factual = new Factual(new FactDictionary());

  it('converts a rational to a decimal string with default scale', () => {
    const node = AsDecimalStringFactory.create(
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 3)))
      )
    );
    expect(node.get(factual)).toEqual(Result.complete('0.33'));
  });

  it('converts a rational to a decimal string with specified scale', () => {
    const node = AsDecimalStringFactory.create(
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 3)))
      ),
      4
    );
    expect(node.get(factual)).toEqual(Result.complete('0.3333'));
  });
});
