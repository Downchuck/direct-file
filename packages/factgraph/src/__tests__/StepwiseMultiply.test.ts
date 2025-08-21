import '../compnodes/register-factories';
import { compNodeRegistry } from '../compnodes/registry';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types/Result';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { StepwiseMultiplyFactory } from '../compnodes/StepwiseMultiply';
import { DollarNodeFactory } from '../compnodes/DollarNode';
import { RationalNodeFactory } from '../compnodes/RationalNode';

describe('StepwiseMultiply', () => {
  const factual = new Factual(new FactDictionary());
  const graph = new Graph(factual);

  compNodeRegistry.register(StepwiseMultiplyFactory);
  compNodeRegistry.register(DollarNodeFactory);
  compNodeRegistry.register(RationalNodeFactory);

  it('multiplies a dollar value by a rational value', () => {
    const node = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'StepwiseMultiply',
        Multiplicand: {
          typeName: 'Dollar',
          value: '100',
        },
        Rate: {
          typeName: 'Rational',
          value: '1/2',
        },
      },
      graph
    );
    expect(node.get(factual)).toEqual(Result.complete(Dollar.fromNumber(50)));
  });
});
