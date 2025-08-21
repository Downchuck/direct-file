import { LessThanOrEqualFactory } from '../compnodes/LessThanOrEqual';
import { IntNode } from '../compnodes/IntNode';
import { DollarNode } from '../compnodes/DollarNode';
import { RationalNode } from '../compnodes/RationalNode';
import { DayNode } from '../compnodes/DayNode';
import { BooleanNode } from '../compnodes/BooleanNode';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { Day } from '../types/Day';

describe('LessThanOrEqual', () => {
  const factual = new Factual(new FactDictionary());

  it('compares two integers and returns true', () => {
    const node = LessThanOrEqualFactory.create([
      new IntNode(Expression.literal(Result.complete(2))),
      new IntNode(Expression.literal(Result.complete(5))),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(true));
  });

  it('compares two integers and returns false', () => {
    const node = LessThanOrEqualFactory.create([
      new IntNode(Expression.literal(Result.complete(5))),
      new IntNode(Expression.literal(Result.complete(2))),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(false));
  });

  it('compares two equal integers and returns true', () => {
    const node = LessThanOrEqualFactory.create([
      new IntNode(Expression.literal(Result.complete(5))),
      new IntNode(Expression.literal(Result.complete(5))),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(true));
  });

  it('compares two dollars and returns true', () => {
    const node = LessThanOrEqualFactory.create([
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(2)))
      ),
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(5)))
      ),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(true));
  });

  it('compares two rationals and returns true', () => {
    const node = LessThanOrEqualFactory.create([
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 3)))
      ),
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 2)))
      ),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(true));
  });

  it('compares two days and returns true', () => {
    const node = LessThanOrEqualFactory.create([
      new DayNode(
        Expression.literal(Result.complete(Day.fromString('2024-03-10')))
      ),
      new DayNode(
        Expression.literal(Result.complete(Day.fromString('2024-03-15')))
      ),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(true));
  });
});
