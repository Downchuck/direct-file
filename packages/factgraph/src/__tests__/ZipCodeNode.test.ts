import { ZipCodeNode } from '../compnodes/ZipCodeNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

describe('ZipCodeNode', () => {
  const factual = new Factual(new FactDictionary());

  it('can be created with a valid zip code', () => {
    const node = new ZipCodeNode(
      Expression.literal(Result.complete('12345'))
    );
    expect(node.get(factual)).toEqual(Result.complete('12345'));
  });
});
