import { TrueFactory } from '../compnodes/True';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

describe('True', () => {
  const factual = new Factual(new FactDictionary());

  it('returns true', () => {
    const node = TrueFactory.create();
    expect(node.get(factual)).toEqual(Result.complete(true));
  });
});
