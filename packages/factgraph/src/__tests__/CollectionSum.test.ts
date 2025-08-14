import { CollectionSumFactory } from '../compnodes/CollectionSum';
import { IntNode } from '../compnodes/IntNode';
import { DollarNode } from '../compnodes/DollarNode';
import { RationalNode } from '../compnodes/RationalNode';
import { Expression } from '../Expression';
import { Result } from '../types/Result';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { MaybeVector } from '../types/MaybeVector';
import { Thunk } from '../Thunk';
import { Explanation } from '../Explanation';

class ListExpression<T> extends Expression<T> {
  constructor(private readonly list: T[], private readonly complete: boolean) {
    super();
  }

  get(factual: Factual): Result<T> {
    throw new Error('Method not implemented.');
  }

  explain(factual: Factual): Explanation {
    throw new Error('Method not implemented.');
  }

  override getVector(factual: Factual): MaybeVector<Thunk<Result<T>>> {
    const thunks = this.list.map((item) => Thunk.of(Result.complete(item)));
    return MaybeVector.multiple(thunks, this.complete);
  }
}

describe('CollectionSum', () => {
  const factual = new Factual(new FactDictionary());
  const factory = new CollectionSumFactory();

  it('sums a collection of integers', () => {
    const numbers = [1, 2, 3];
    const expr = new ListExpression(numbers, true);
    const intNode = new IntNode(expr as unknown as Expression<number>);

    const sumNode = factory.create!([intNode]) as IntNode;
    const result = sumNode.get(factual);

    expect(result.isComplete).toBe(true);
    expect(result.get).toBe(6);
  });

  it('sums a collection of dollars', () => {
    const dollars = [
      Dollar.fromNumber(1),
      Dollar.fromNumber(2),
      Dollar.fromNumber(3),
    ];
    const expr = new ListExpression(dollars, true);
    const dollarNode = new DollarNode(expr as unknown as Expression<Dollar>);

    const sumNode = factory.create!([dollarNode]) as DollarNode;
    const result = sumNode.get(factual);

    expect(result.isComplete).toBe(true);
    expect(result.get).toEqual(Dollar.fromNumber(6));
  });

  it('sums a collection of rationals', () => {
    const rationals = [
      new Rational(1, 2),
      new Rational(1, 3),
      new Rational(1, 6),
    ];
    const expr = new ListExpression(rationals, true);
    const rationalNode = new RationalNode(
      expr as unknown as Expression<Rational>
    );

    const sumNode = factory.create!([rationalNode]) as RationalNode;
    const result = sumNode.get(factual);

    expect(result.isComplete).toBe(true);
    expect(result.get.equals(new Rational(1, 1))).toBe(true);
  });

  it('returns incomplete if the collection is incomplete', () => {
    const numbers = [1, 2, 3];
    const expr = new ListExpression(numbers, false); // Incomplete
    const intNode = new IntNode(expr as unknown as Expression<number>);

    const sumNode = factory.create!([intNode]) as IntNode;
    const result = sumNode.get(factual);

    expect(result.isComplete).toBe(false);
    expect(result.get).toBe(6);
  });
});
