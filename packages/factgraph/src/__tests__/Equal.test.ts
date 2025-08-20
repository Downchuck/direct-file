import '../compnodes';
import { compNodeRegistry } from '../compnodes/CompNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

describe('Equal', () => {
  const factual = new Factual(new FactDictionary());

  it('returns false if the inputs are different', () => {
    const node = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'Equal',
        children: [
          {
            typeName: 'Int',
            value: '1',
          },
          {
            typeName: 'Int',
            value: '2',
          },
        ],
      },
      factual.graph
    );
    expect(node.get(factual)).toEqual(Result.complete(false));
  });

  it('returns true if the inputs are the same', () => {
    const node = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'Equal',
        children: [
          {
            typeName: 'String',
            value: 'Test',
          },
          {
            typeName: 'String',
            value: 'Test',
          },
        ],
      },
      factual.graph
    );
    expect(node.get(factual)).toEqual(Result.complete(true));
  });
});
