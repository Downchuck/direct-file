import { FalseFactory } from '../compnodes/False';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

describe('False', () => {
  const factual = new Factual(new FactDictionary());

  it('returns false', () => {
    const node = FalseFactory.create();
    expect(node.get(factual)).toEqual(Result.complete(false));
  });
});
