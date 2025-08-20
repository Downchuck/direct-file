import '../compnodes';
import { compNodeRegistry } from '../compnodes/registry';
import { StringNode } from '../compnodes/StringNode';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';

describe('MultiEnumNode', () => {
  const factual = new Factual(new FactDictionary());
  const options = ['a', 'b', 'c'];

  it('can be created with a valid selection', () => {
    const node = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'MultiEnum',
        options,
        children: [
          { typeName: 'String', value: 'a' },
          { typeName: 'String', value: 'c' },
        ],
      },
      factual.graph
    );
    expect(node.get(factual)).toEqual(Result.complete(['a', 'c']));
  });

  it('is incomplete with an invalid selection', () => {
    const node = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'MultiEnum',
        options,
        children: [
          { typeName: 'String', value: 'a' },
          { typeName: 'String', value: 'd' },
        ],
      },
      factual.graph
    );
    expect(node.get(factual).isComplete).toBe(false);
  });
});
