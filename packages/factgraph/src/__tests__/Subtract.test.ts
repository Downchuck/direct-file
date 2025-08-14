import {
  SubtractFactory,
  IntNode,
  DollarNode,
  RationalNode,
  DayNode,
  DaysNode,
} from '../compnodes';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { Day } from '../types/Day';
import { Days } from '../types/Days';

describe('Subtract', () => {
  const factual = new Factual(new FactDictionary());
  const factory = new SubtractFactory();

  it('subtracts two integers', () => {
    const node = factory.create([
      new IntNode(Expression.literal(Result.complete(5))),
      new IntNode(Expression.literal(Result.complete(2))),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(3));
  });

  it('subtracts multiple integers', () => {
    const node = factory.create([
      new IntNode(Expression.literal(Result.complete(10))),
      new IntNode(Expression.literal(Result.complete(2))),
      new IntNode(Expression.literal(Result.complete(3))),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(5));
  });

  it('subtracts two dollars', () => {
    const node = factory.create([
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(5)))
      ),
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(2)))
      ),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(Dollar.fromNumber(3))
    );
  });

  it('subtracts two rationals', () => {
    const node = factory.create([
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 2)))
      ),
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 3)))
      ),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(new Rational(1, 6))
    );
  });

  it('subtracts an integer from a dollar', () => {
    const node = factory.create([
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(5)))
      ),
      new IntNode(Expression.literal(Result.complete(2))),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(Dollar.fromNumber(3))
    );
  });

  it('subtracts a dollar from an integer', () => {
    const node = factory.create([
      new IntNode(Expression.literal(Result.complete(5))),
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(2)))
      ),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(Dollar.fromNumber(3))
    );
  });

  it('subtracts a rational from an integer', () => {
    const node = factory.create([
      new IntNode(Expression.literal(Result.complete(1))),
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 2)))
      ),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(new Rational(1, 2))
    );
  });

  it('subtracts an integer from a rational', () => {
    const node = factory.create([
      new RationalNode(
        Expression.literal(Result.complete(new Rational(3, 2)))
      ),
      new IntNode(Expression.literal(Result.complete(1))),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(new Rational(1, 2))
    );
  });

  it('subtracts a rational from a dollar', () => {
    const node = factory.create([
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(1.5)))
      ),
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 2)))
      ),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(Dollar.fromNumber(1))
    );
  });

  it('subtracts a dollar from a rational', () => {
    const node = factory.create([
      new RationalNode(
        Expression.literal(Result.complete(new Rational(3, 2)))
      ),
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(1)))
      ),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(Dollar.fromNumber(0.5))
    );
  });

  it('subtracts days from a day', () => {
    const node = factory.create([
      new DayNode(
        Expression.literal(Result.complete(Day.fromString('2024-03-15')))
      ),
      new DaysNode(Expression.literal(Result.complete(new Days(5)))),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(Day.fromString('2024-03-10'))
    );
  });
});
