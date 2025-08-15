import { PinNode, compNodeRegistry } from '../compnodes';
import { Pin } from '../types/Pin';
import { Result } from '../types';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';

describe('PinNode', () => {
  it('can be created', () => {
    const dictionary = new FactDictionary();
    dictionary.addDefinition({
      path: '/test',
      writable: {
        typeName: 'Pin',
      },
    });
    const factual = new Factual(dictionary);
    const node = compNodeRegistry.fromWritableConfig(
      { typeName: 'Pin' },
      factual.graph
    );
    expect(node).toBeDefined();
  });
});
