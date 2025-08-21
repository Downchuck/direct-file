import { PhoneNumberNode } from '../compnodes/PhoneNumberNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

describe('PhoneNumberNode', () => {
  const factual = new Factual(new FactDictionary());

  it('can be created with a valid phone number', () => {
    const node = new PhoneNumberNode(
      Expression.literal(Result.complete('123-456-7890'))
    );
    expect(node.get(factual)).toEqual(Result.complete('123-456-7890'));
  });
});
