import { RegexFactory } from '../compnodes/Regex';
import { StringNode } from '../compnodes/StringNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

describe('Regex', () => {
  const factual = new Factual(new FactDictionary());

  it('returns true if the string matches the regex', () => {
    const node = RegexFactory.create([
      new StringNode(Expression.literal(Result.complete('a'))),
      new StringNode(Expression.literal(Result.complete('a'))),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(true));
  });

  it('returns false if the string does not match the regex', () => {
    const node = RegexFactory.create([
      new StringNode(Expression.literal(Result.complete('a'))),
      new StringNode(Expression.literal(Result.complete('b'))),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(false));
  });
});
