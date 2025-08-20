import '../compnodes';
import { EnumOptionsSizeFactory } from '../compnodes/EnumOptionsSize';
import { EnumOptionsNode } from '../compnodes/EnumOptionsNode';
import { Result } from '../types';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Expression } from '../Expression';

describe('EnumOptionsSize', () => {
  it('returns the size of an enum options list', () => {
    const factual = new Factual(new FactDictionary());
    const options = ['a', 'b', 'c'];
    const optionsNode = new EnumOptionsNode(
      Expression.literal(Result.complete(options))
    );
    const sizeNode = EnumOptionsSizeFactory.fromDerivedConfig(
      { typeName: 'EnumOptionsSize', children: [optionsNode] },
      factual.graph
    );
    const result = sizeNode.get(factual);
    expect(result.get).toBe(3);
  });
});
