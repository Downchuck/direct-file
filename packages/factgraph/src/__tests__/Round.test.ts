import '../compnodes';
import { RoundFactory } from '../compnodes/Round';
import { RationalNode } from '../compnodes/RationalNode';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';
import { Rational } from '../types/Rational';

describe('Round', () => {
  const factual = new Factual(new FactDictionary());

  it('rounds a rational to the nearest integer', () => {
    const node = RoundFactory.fromDerivedConfig(
      {
        typeName: 'Round',
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
