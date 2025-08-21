import { RootNode } from '../compnodes/RootNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

describe('RootNode', () => {
  const factual = new Factual(new FactDictionary());

  it('can be created', () => {
    const node = new RootNode();
    expect(node.get(factual)).toEqual(Result.complete(null));
  });
});
