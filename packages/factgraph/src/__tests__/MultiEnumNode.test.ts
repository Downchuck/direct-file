import { MultiEnumNode, compNodeRegistry } from '../compnodes';
import { MultiEnum } from '../types/MultiEnum';
import { Result } from '../types';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';

describe('MultiEnumNode', () => {
  it('can be created', () => {
    const dictionary = new FactDictionary();
    dictionary.addDefinition({
      path: '/test',
      writable: {
        typeName: 'MultiEnum',
        options: [{ name: 'optionsPath', value: '/enumOptions' }],
      },
    });
    const factual = new Factual(dictionary);
    const node = compNodeRegistry.fromWritableConfig(
      { typeName: 'MultiEnum' },
      factual.graph
    );
    expect(node).toBeDefined();
  });
});
