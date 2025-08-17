import { RoundToIntFactory } from '../compnodes/RoundToInt';
import { RationalNode } from '../compnodes/RationalNode';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';
import { Rational } from '../types/Rational';

describe('RoundToInt', () => {
  const factual = new Factual(new FactDictionary());

  it('rounds a rational to the nearest integer', () => {
    const node = RoundToIntFactory.fromDerivedConfig(
      {
        typeName: 'RoundToInt',
        children: [
          new RationalNode(
            Expression.literal(Result.complete(new Rational(5, 2)))
          ),
        ],
      },
      factual.graph
    );
    expect(node.get(factual)).toEqual(Result.complete(3));
  });
});
