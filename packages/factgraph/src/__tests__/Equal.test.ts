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
            key: 'Left',
            children: [
              {
                typeName: 'Int',
                value: '1',
              },
            ],
          },
          {
            key: 'Right',
            children: [
              {
                typeName: 'Int',
                value: '2',
              },
            ],
          },
        ],
      },
      factual,
      new FactDictionary()
    );
    expect(node.get(factual)).toEqual(Result.complete(false));
  });

  it('returns true if the inputs are the same', () => {
    const node = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'Equal',
        children: [
          {
            key: 'Left',
            children: [
              {
                typeName: 'String',
                value: 'Test',
              },
            ],
          },
          {
            key: 'Right',
            children: [
              {
                typeName: 'String',
                value: 'Test',
              },
            ],
          },
        ],
      },
      factual,
      new FactDictionary()
    );
    expect(node.get(factual)).toEqual(Result.complete(true));
  });
});
