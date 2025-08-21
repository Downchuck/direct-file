import { TodayNodeFactory } from '../compnodes/TodayNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';
import { Day } from '../types/Day';

describe('TodayNode', () => {
  const factual = new Factual(new FactDictionary());

  it('returns the current date', () => {
    const node = TodayNodeFactory.fromDerivedConfig({}, factual.graph);
    const result = node.get(factual);
    const expected = new Day();
    expect(result.get.year).toEqual(expected.year);
    expect(result.get.month).toEqual(expected.month);
    expect(result.get.day).toEqual(expected.day);
  });
});
