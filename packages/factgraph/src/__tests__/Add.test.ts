import { AddFactory, IntNode, DollarNode, RationalNode } from '../compnodes';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';

describe('Add', () => {
  const factual = new Factual(new FactDictionary());
  const factory = new AddFactory();

  it('adds two integers', () => {
    const node = factory.create([
      new IntNode(Expression.literal(Result.complete(1))),
      new IntNode(Expression.literal(Result.complete(2))),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(3));
  });

  it('adds two dollars', () => {
    const node = factory.create([
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(1)))
      ),
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(2)))
      ),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(Dollar.fromNumber(3))
    );
  });

  it('adds two rationals', () => {
    const node = factory.create([
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 2)))
      ),
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 3)))
      ),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(new Rational(5, 6))
    );
  });

  it('adds an integer and a dollar', () => {
    const node = factory.create([
      new IntNode(Expression.literal(Result.complete(1))),
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(2)))
      ),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(Dollar.fromNumber(3))
    );
  });

  it('adds a dollar and an integer', () => {
    const node = factory.create([
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(1)))
      ),
      new IntNode(Expression.literal(Result.complete(2))),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(Dollar.fromNumber(3))
    );
  });

  it('adds an integer and a rational', () => {
    const node = factory.create([
      new IntNode(Expression.literal(Result.complete(1))),
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 2)))
      ),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(new Rational(3, 2))
    );
  });

  it('adds a rational and an integer', () => {
    const node = factory.create([
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 2)))
      ),
      new IntNode(Expression.literal(Result.complete(1))),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(new Rational(3, 2))
    );
  });

  it('adds a dollar and a rational', () => {
    const node = factory.create([
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(1)))
      ),
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 2)))
      ),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(Dollar.fromNumber(1.5))
    );
  });

  it('adds a rational and a dollar', () => {
    const node = factory.create([
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 2)))
      ),
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(1)))
      ),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(Dollar.fromNumber(1.5))
    );
  });
});
