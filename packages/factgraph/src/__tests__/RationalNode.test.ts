import { RationalNode } from '../compnodes/RationalNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';
import { Rational } from '../types/Rational';

describe('RationalNode', () => {
  const factual = new Factual(new FactDictionary());

  it('can be created with a valid rational', () => {
    const rational = new Rational(1, 2);
    const node = new RationalNode(
      Expression.literal(Result.complete(rational))
    );
    expect(node.get(factual)).toEqual(Result.complete(rational));
  });
});
