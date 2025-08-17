import { PinNodeFactory } from '../compnodes/PinNode';
import { StringNode } from '../compnodes/StringNode';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';

describe('PinNode', () => {
  const factual = new Factual(new FactDictionary());

  it('can be created with a valid PIN', () => {
    const node = PinNodeFactory.fromDerivedConfig(
      {
        typeName: 'Pin',
        children: [
          new StringNode(Expression.literal(Result.complete('12345'))),
        ],
      },
      factual.graph
    );
    expect(node.get(factual)).toEqual(Result.complete('12345'));
  });

  it('is incomplete with an invalid PIN', () => {
    const node = PinNodeFactory.fromDerivedConfig(
      {
        typeName: 'Pin',
        children: [
          new StringNode(Expression.literal(Result.complete('1234'))),
        ],
      },
      factual.graph
    );
    expect(node.get(factual).isComplete).toBe(false);
  });
});
