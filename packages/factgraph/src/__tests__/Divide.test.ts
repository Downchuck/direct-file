import { DivideFactory } from '../compnodes/Divide';
import { IntNode } from '../compnodes/IntNode';
import { DollarNode } from '../compnodes/DollarNode';
import { RationalNode } from '../compnodes/RationalNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { Expression } from '../Expression';

describe('Divide', () => {
  const factual = new Factual(new FactDictionary());

  it('divides Rationals', () => {
    const node = DivideFactory.create([
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 2)))
      ),
      new RationalNode(
        Expression.literal(Result.complete(new Rational(2, 3)))
      ),
      new RationalNode(
        Expression.literal(Result.complete(new Rational(3, 4)))
      ),
    ]);
    expect(node.get(factual)).toEqual(Result.complete(new Rational(1, 1)));
  });

  it('divides Dollars', () => {
    const node = DivideFactory.create([
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(100)))
      ),
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(1.23)))
      ),
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(4.56)))
      ),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(Dollar.fromNumber(17.83))
    );
  });

  it('divides a long sequence of mixed types', () => {
    const node = DivideFactory.create([
      new RationalNode(
        Expression.literal(Result.complete(new Rational(6, 7)))
      ),
      new IntNode(Expression.literal(Result.complete(1))),
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 2)))
      ),
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(3.45)))
      ),
      new RationalNode(
        Expression.literal(Result.complete(new Rational(1, 2)))
      ),
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(0.1)))
      ),
      new IntNode(Expression.literal(Result.complete(5))),
    ]);
    expect(node.get(factual)).toEqual(
      Result.complete(Dollar.fromNumber(2.0))
    );
  });

  describe('when dividing an Int and an Int', () => {
    it('returns a Rational', () => {
      const node = DivideFactory.create([
        new IntNode(Expression.literal(Result.complete(1))),
        new IntNode(Expression.literal(Result.complete(2))),
      ]);
      expect(node.get(factual)).toEqual(
        Result.complete(new Rational(1, 2))
      );
    });
  });
});
