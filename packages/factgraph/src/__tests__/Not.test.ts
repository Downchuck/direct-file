import { describe, it, expect } from '@jest/globals';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types/Result';
import { BooleanNode } from '../compnodes/BooleanNode';
import { Not } from '../compnodes/Not';
import { compNodeRegistry } from '../compnodes/CompNode';
import '../compnodes/True';

const factual = new Factual(new FactDictionary());

describe('Not', () => {
  it('returns the opposite of its input', () => {
    const trueNode = compNodeRegistry.fromDerivedConfig(
      { typeName: 'True', children: [] },
      factual,
      new FactDictionary()
    ) as BooleanNode;
    const node = Not(trueNode);
    expect(node.get(factual)).toEqual(Result.complete(false));
  });
});
