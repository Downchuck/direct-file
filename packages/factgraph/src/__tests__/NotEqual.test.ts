import { describe, it, expect } from '@jest/globals';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types/Result';
import { compNodeRegistry } from '../compnodes/CompNode';
import '../compnodes/IntNode';
import '../compnodes/StringNode';
import '../compnodes/DollarNode';
import { NotEqual } from '../compnodes/NotEqual';
import { IntNode } from '../compnodes/IntNode';
import { Expression } from '../Expression';

const factual = new Factual(new FactDictionary());

describe('NotEqual', () => {
  it('returns true if the inputs are different', () => {
    const node = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'NotEqual',
        children: [
          {
            typeName: 'Left',
            children: [
              {
                typeName: 'Int',
                config: { value: '1' },
              },
            ],
          },
          {
            typeName: 'Right',
            children: [
              {
                typeName: 'Int',
                config: { value: '2' },
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

  it('returns false if the inputs are the same', () => {
    const node = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'NotEqual',
        children: [
          {
            typeName: 'Left',
            children: [
              {
                typeName: 'String',
                config: { value: 'Test' },
              },
            ],
          },
          {
            typeName: 'Right',
            children: [
              {
                typeName: 'String',
                config: { value: 'Test' },
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

  it('requires both inputs to be of the same type', () => {
    const lhs = new IntNode(Expression.literal(Result.complete(1)));
    const rhs = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'Dollar',
        config: { value: '1.00' },
      },
      factual,
      new FactDictionary()
    );

    expect(() => NotEqual(lhs, rhs as any)).toThrow(
      'cannot compare a IntNode and a DollarNode'
    );
  });
});
