import { compNodeRegistry } from '../compnodes/CompNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

describe('Not', () => {
  const factual = new Factual(new FactDictionary());

  it('returns the opposite of its input', () => {
    const node = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'Not',
        children: [
          {
            typeName: 'True',
          },
        ],
      },
      factual,
      new FactDictionary()
    );
    expect(node.get(factual)).toEqual(Result.complete(false));
  });

  it('requires a boolean input', () => {
    expect(() => {
      compNodeRegistry.fromDerivedConfig(
        {
          typeName: 'Not',
          children: [
            {
              typeName: 'Int',
              value: '42',
            },
          ],
        },
        factual,
        new FactDictionary()
      );
    }).toThrow();
  });
});
