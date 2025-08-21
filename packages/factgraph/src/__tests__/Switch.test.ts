import { SwitchFactory } from '../compnodes/Switch';
import { TrueFactory } from '../compnodes/True';
import { FalseFactory } from '../compnodes/False';
import { IntNode } from '../compnodes/IntNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

describe('Switch', () => {
  const factual = new Factual(new FactDictionary());

  it('returns the first case that is true', () => {
    const node = SwitchFactory.create([
      [FalseFactory.create(), new IntNode(Expression.literal(Result.complete(1)))],
      [TrueFactory.create(), new IntNode(Expression.literal(Result.complete(2)))],
      [TrueFactory.create(), new IntNode(Expression.literal(Result.complete(3)))],
    ]);
    expect(node.get(factual)).toEqual(Result.complete(2));
  });
});
