import { CollectionSumFactory } from '../../compnodes/CollectionSum';
import { DependencyNode } from '../../compnodes/Dependency';
import { Factual } from '../../Factual';
import { FactDictionary } from '../../FactDictionary';
import { IntNode } from '../IntNode';
import { Expression } from '../../Expression';
import { Result } from '../../types';
import { IntNode } from '../../compnodes/IntNode';
import { DollarNode } from '../../compnodes/DollarNode';
import { RationalNode } from '../../compnodes/RationalNode';
import { Dollar } from '../../types/Dollar';
import { Rational } from '../../types/Rational';
import { DependencyExpression } from '../../expressions/DependencyExpression';
import { Path } from '../../Path';

describe('CollectionSum', () => {
  const factual = new Factual(new FactDictionary());

  it('sums Ints', () => {
    const node = CollectionSumFactory.create([
      new DependencyNode(
        new DependencyExpression(Path.fromString('/collection/*/int'))
      ),
    ]);
    const collection = {
      '#1': { int: new IntNode(Expression.literal(Result.complete(1))) },
      '#2': { int: new IntNode(Expression.literal(Result.complete(2))) },
    };
    const factual = new Factual(new FactDictionary(), {
      '/collection': collection,
    });
    expect(node.get(factual)).toEqual(Result.complete(3));
  });

  it('sums Rationals', () => {
    const node = CollectionSumFactory.create([
      new DependencyNode(
        new DependencyExpression(Path.fromString('/collection/*/rational'))
      ),
    ]);
    const collection = {
      '#1': {
        rational: new RationalNode(
          Expression.literal(Result.complete(new Rational(1, 2)))
        ),
      },
      '#2': {
        rational: new RationalNode(
          Expression.literal(Result.complete(new Rational(1, 3)))
        ),
      },
    };
    const factual = new Factual(new FactDictionary(), {
      '/collection': collection,
    });
    expect(node.get(factual)).toEqual(
      Result.complete(new Rational(5, 6))
    );
  });

  it('sums Dollars', () => {
    const node = CollectionSumFactory.create([
      new DependencyNode(
        new DependencyExpression(Path.fromString('/collection/*/dollar'))
      ),
    ]);
    const collection = {
      '#1': {
        dollar: new DollarNode(
          Expression.literal(Result.complete(Dollar.fromNumber(1.23)))
        ),
      },
      '#2': {
        dollar: new DollarNode(
          Expression.literal(Result.complete(Dollar.fromNumber(4.56)))
        ),
      },
    };
    const factual = new Factual(new FactDictionary(), {
      '/collection': collection,
    });
    expect(node.get(factual)).toEqual(
      Result.complete(Dollar.fromNumber(5.79))
    );
  });
});
