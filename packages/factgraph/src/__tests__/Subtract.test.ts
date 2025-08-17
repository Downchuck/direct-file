import { SubtractFactory } from '../compnodes/Subtract';
import { IntNode } from '../compnodes/IntNode';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';

describe('Subtract', () => {
  const factual = new Factual(new FactDictionary());

  it('subtracts two integers', () => {
    const node = SubtractFactory.fromDerivedConfig(
      {
        typeName: 'Subtract',
        children: [
          new IntNode(Expression.literal(Result.complete(5))),
          new IntNode(Expression.literal(Result.complete(2))),
        ],
      },
      factual.graph
    );
    expect(node.get(factual)).toEqual(Result.complete(3));
  });
});
