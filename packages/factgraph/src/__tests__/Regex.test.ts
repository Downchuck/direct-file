import '../compnodes/register-factories';
import { compNodeRegistry } from '../compnodes/registry';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types/Result';

describe('Regex', () => {
  const factual = new Factual(new FactDictionary());
  const graph = new Graph(factual);

  it('returns true when the input matches the pattern', () => {
    const node = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'Regex',
        Input: {
          typeName: 'String',
          value: 'hello world',
        },
        Pattern: {
          typeName: 'String',
          value: '^hello',
        },
      },
      graph
    );
    expect(node.get(factual)).toEqual(Result.complete(true));
  });

  it('returns false when the input does not match the pattern', () => {
    const node = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'Regex',
        Input: {
          typeName: 'String',
          value: 'hello world',
        },
        Pattern: {
          typeName: 'String',
          value: 'goodbye',
        },
      },
      graph
    );
    expect(node.get(factual)).toEqual(Result.complete(false));
  });
});
