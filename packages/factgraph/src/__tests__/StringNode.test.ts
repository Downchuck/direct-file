import { StringNode } from '../compnodes/StringNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

describe('StringNode', () => {
  const factual = new Factual(new FactDictionary());

  it('can be created with a valid string', () => {
    const node = new StringNode(Expression.literal(Result.complete('a')));
    expect(node.get(factual)).toEqual(Result.complete('a'));
  });
});
