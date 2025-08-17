import { IpPinNodeFactory } from '../compnodes/IpPinNode';
import { StringNode } from '../compnodes/StringNode';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';

describe('IpPinNode', () => {
  const factual = new Factual(new FactDictionary());

  it('can be created with a valid IP PIN', () => {
    const node = IpPinNodeFactory.fromDerivedConfig(
      {
        typeName: 'IpPin',
        children: [
          new StringNode(Expression.literal(Result.complete('123456'))),
        ],
      },
      factual.graph
    );
    expect(node.get(factual)).toEqual(Result.complete('123456'));
  });

  it('is incomplete with an invalid IP PIN', () => {
    const node = IpPinNodeFactory.fromDerivedConfig(
      {
        typeName: 'IpPin',
        children: [
          new StringNode(Expression.literal(Result.complete('12345'))),
        ],
      },
      factual.graph
    );
    expect(node.get(factual).isComplete).toBe(false);
  });
});
