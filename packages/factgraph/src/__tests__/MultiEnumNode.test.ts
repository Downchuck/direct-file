import { MultiEnumNodeFactory } from '../compnodes/MultiEnumNode';
import { StringNode } from '../compnodes/StringNode';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';

describe('MultiEnumNode', () => {
  const factual = new Factual(new FactDictionary());
  const options = ['a', 'b', 'c'];

  it('can be created with a valid selection', () => {
    const node = MultiEnumNodeFactory.create(
      [
        new StringNode(Expression.literal(Result.complete('a'))),
        new StringNode(Expression.literal(Result.complete('c'))),
      ],
      options
    );
    expect(node.get(factual)).toEqual(Result.complete(['a', 'c']));
  });

  it('is incomplete with an invalid selection', () => {
    const node = MultiEnumNodeFactory.create(
      [
        new StringNode(Expression.literal(Result.complete('a'))),
        new StringNode(Expression.literal(Result.complete('d'))),
      ],
      options
    );
    expect(node.get(factual).isComplete).toBe(false);
  });
});
