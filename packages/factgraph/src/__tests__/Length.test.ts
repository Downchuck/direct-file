import '../compnodes';
import { LengthFactory } from '../compnodes/Length';
import { StringNode } from '../compnodes/StringNode';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';

describe('Length', () => {
  const factual = new Factual(new FactDictionary());

  it('returns the length of a string', () => {
    const node = LengthFactory.fromDerivedConfig(
      {
        typeName: 'Length',
        children: [
          new StringNode(Expression.literal(Result.complete('hello'))),
        ],
      },
      factual.graph
    );
    expect(node.get(factual)).toEqual(Result.complete(5));
  });
});
