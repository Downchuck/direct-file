import '../compnodes';
import { compNodeRegistry } from '../compnodes/registry';
import { RationalNode } from '../compnodes/RationalNode';
import { Result } from '../types/Result';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';
import { Rational } from '../types/Rational';

describe('AsDecimalString', () => {
  const factual = new Factual(new FactDictionary());

  it('converts a rational to a decimal string with default scale', () => {
    const node = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'AsDecimalString',
        children: [
          new RationalNode(
            Expression.literal(Result.complete(new Rational(1, 3)))
          ),
        ],
      },
      factual.graph
    );
    expect(node.get(factual)).toEqual(Result.complete('0.33'));
  });

  it('converts a rational to a decimal string with specified scale', () => {
    const node = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'AsDecimalString',
        options: { scale: 4 },
        children: [
          new RationalNode(
            Expression.literal(Result.complete(new Rational(1, 3)))
          ),
        ],
      },
      factual.graph
    );
    expect(node.get(factual)).toEqual(Result.complete('0.3333'));
  });
});
