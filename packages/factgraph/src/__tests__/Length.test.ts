import { LengthFactory, StringNode } from '../compnodes';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';

describe('Length', () => {
  const factual = new Factual(new FactDictionary());
  const factory = new LengthFactory();

  it('returns the length of a string', () => {
    const node = new StringNode(
      Expression.literal(Result.complete('hello'))
    );
    const lengthNode = factory.create(node);
    expect(lengthNode.get(factual)).toEqual(Result.complete(5));
  });

  it('returns the length of an empty string', () => {
    const node = new StringNode(Expression.literal(Result.complete('')));
    const lengthNode = factory.create(node);
    expect(lengthNode.get(factual)).toEqual(Result.complete(0));
  });
});
