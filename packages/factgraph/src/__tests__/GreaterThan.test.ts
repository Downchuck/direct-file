import {
  GreaterThanFactory,
  IntNode,
  DollarNode,
  RationalNode,
  DayNode,
  BooleanNode,
} from '../compnodes';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { Day } from '../types/Day';

describe('GreaterThan', () => {
  const factual = new Factual(new FactDictionary());
  const factory = new GreaterThanFactory();

  it('compares two integers and returns true', () => {
    const node = factory.create(
      new IntNode(Expression.literal(Result.complete(5))),
      new IntNode(Expression.literal(Result.complete(2)))
    );
    expect(node.get(factual)).toEqual(Result.complete(true));
  });

  it('compares two integers and returns false', () => {
    const node = factory.create(
      new IntNode(Expression.literal(Result.complete(2))),
      new IntNode(Expression.literal(Result.complete(5)))
    );
    expect(node.get(factual)).toEqual(Result.complete(false));
  });

  it('compares two equal integers and returns false', () => {
    const node = factory.create(
      new IntNode(Expression.literal(Result.complete(5))),
      new IntNode(Expression.literal(Result.complete(5)))
    );
    expect(node.get(factual)).toEqual(Result.complete(false));
  });

  it('compares two dollars and returns true', () => {
    const node = factory.create(
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(5)))
      ),
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(2)))
      )
    );
    expect(node.get(factual)).toEqual(Result.complete(true));
  });

  it('compares two rationals and returns true', () => {
    const node = factory.create(
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 2)))
      ),
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 3)))
      )
    );
    expect(node.get(factual)).toEqual(Result.complete(true));
  });

  it('compares two days and returns true', () => {
    const node = factory.create(
      new DayNode(
        Expression.literal(Result.complete(Day.fromString('2024-03-15')))
      ),
      new DayNode(
        Expression.literal(Result.complete(Day.fromString('2024-03-10')))
      )
    );
    expect(node.get(factual)).toEqual(Result.complete(true));
  });
});
