import { StepwiseMultiplyFactory } from '../compnodes/StepwiseMultiply';
import { IntNode } from '../compnodes/IntNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

describe('StepwiseMultiply', () => {
  const factual = new Factual(new FactDictionary());

  it('multiplies two integers', () => {
    const node = StepwiseMultiplyFactory.create([
      new IntNode(Expression.literal(Result.complete(2))),
      new IntNode(Expression.literal(Result.complete(3))),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(6));
  });
});
