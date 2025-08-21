import { Any } from '../compnodes/Any';
import { BooleanNode } from '../compnodes/BooleanNode';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';

const True = () =>
  new BooleanNode(Expression.literal(Result.complete(true)));
const False = () =>
  new BooleanNode(Expression.literal(Result.complete(false)));

describe('Any', () => {
  const factual = new Factual(new FactDictionary());

  it('returns true if any input is true', () => {
    const node = Any([False(), False(), True()]);
    expect(node.get(factual)).toEqual(Result.complete(true));
  });

  it('returns false if all inputs are false', () => {
    const node = Any([False(), False(), False()]);
    expect(node.get(factual)).toEqual(Result.complete(false));
  });
});
