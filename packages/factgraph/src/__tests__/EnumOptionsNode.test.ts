import { EnumOptionsNode } from '../compnodes/EnumOptionsNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

describe('EnumOptionsNode', () => {
  const factual = new Factual(new FactDictionary());

  it('can be created with a list of options', () => {
    const options = ['a', 'b', 'c'];
    const node = new EnumOptionsNode(
      Expression.literal(Result.complete(options))
    );
    expect(node.get(factual)).toEqual(Result.complete(options));
  });
});
