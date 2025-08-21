import { DaysNode } from '../compnodes/DaysNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';
import { Days } from '../types/Days';

describe('DaysNode', () => {
  const factual = new Factual(new FactDictionary());

  it('can be created with a valid number of days', () => {
    const days = new Days(10);
    const node = new DaysNode(Expression.literal(Result.complete(days)));
    expect(node.get(factual)).toEqual(Result.complete(days));
  });
});
