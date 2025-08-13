import { GreaterOf } from '../compnodes/GreaterOf';
import { IntNode } from '../compnodes/IntNode';
import { LesserOf } from '../compnodes/LesserOf';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Expression } from '../Expression';
import { Result } from '../types/Result';
import { CompNode } from '../compnodes/CompNode';

const factual = new Factual(new FactDictionary());

const intNode = (n: number) =>
  new IntNode(Expression.literal(Result.complete(n)));

describe('LesserOf', () => {
  it('should return the lesser of two numbers', () => {
    const lesserOfNode = LesserOf([intNode(1), intNode(2)]);
    expect(lesserOfNode.get(factual)).toEqual(Result.complete(1));
  });

  it('should return the lesser of multiple numbers', () => {
    const lesserOfNode = LesserOf([intNode(3), intNode(1), intNode(2)]);
    expect(lesserOfNode.get(factual)).toEqual(Result.complete(1));
  });
});

describe('GreaterOf', () => {
  it('should return the greater of two numbers', () => {
    const greaterOfNode = GreaterOf([intNode(1), intNode(2)]);
    expect(greaterOfNode.get(factual)).toEqual(Result.complete(2));
  });

  it('should return the greater of multiple numbers', () => {
    const greaterOfNode = GreaterOf([intNode(3), intNode(1), intNode(2)]);
    expect(greaterOfNode.get(factual)).toEqual(Result.complete(3));
  });
});
