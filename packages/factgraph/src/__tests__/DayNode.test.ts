import { DayNode } from '../compnodes/DayNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';
import { Day } from '../types/Day';

describe('DayNode', () => {
  const factual = new Factual(new FactDictionary());

  it('can be created with a valid day', () => {
    const day = new Day('2024-03-10');
    const node = new DayNode(Expression.literal(Result.complete(day)));
    expect(node.get(factual)).toEqual(Result.complete(day));
  });
});
