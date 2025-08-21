import '../compnodes/register-factories';
import { compNodeRegistry } from '../compnodes/registry';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types/Result';
import { ZipCodeNodeFactory } from '../compnodes/ZipCodeNode';

describe('ZipCodeNode', () => {
  const factual = new Factual(new FactDictionary());
  const graph = new Graph(factual);

  compNodeRegistry.register(ZipCodeNodeFactory);

  it('can be created from a writable config', () => {
    const node = compNodeRegistry.fromWritableConfig(
      {
        typeName: 'ZipCode',
      },
      graph
    );
    expect(node.get(factual)).toEqual(Result.incomplete());
  });
});
