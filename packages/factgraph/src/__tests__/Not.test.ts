import { NotFactory } from '../compnodes/Not';
import { TrueFactory } from '../compnodes/True';
import { IntNode } from '../compnodes/IntNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';
import { Expression } from '../Expression';

describe('Not', () => {
  const factual = new Factual(new FactDictionary());

  it('returns the opposite of its input', () => {
    const node = NotFactory.create([TrueFactory.create()]);
    expect(node.get(factual)).toEqual(Result.complete(false));
  });

  it('requires a boolean input', () => {
    expect(() => {
      NotFactory.create([
        new IntNode(Expression.literal(Result.complete(42))),
      ]);
    }).toThrow();
  });
});
