import { NotEqualFactory } from '../compnodes/NotEqual';
import { IntNode } from '../compnodes/IntNode';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';

describe('NotEqual', () => {
  const factual = new Factual(new FactDictionary());

  it('compares two different integers and returns true', () => {
    const node = NotEqualFactory.create([
      new IntNode(Expression.literal(Result.complete(2))),
      new IntNode(Expression.literal(Result.complete(5))),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(true));
  });

  it('compares two equal integers and returns false', () => {
    const node = NotEqualFactory.create([
      new IntNode(Expression.literal(Result.complete(5))),
      new IntNode(Expression.literal(Result.complete(5))),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(false));
  });
});
