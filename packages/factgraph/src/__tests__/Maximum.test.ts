import { MaximumFactory } from '../compnodes/Maximum';
import { DependencyNode } from '../compnodes/Dependency';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { IntNode } from '../compnodes/IntNode';
import { Expression } from '../Expression';
import { Result } from '../types';
import { DollarNode } from '../compnodes/DollarNode';
import { Dollar } from '../types/Dollar';
import { DependencyExpression } from '../expressions/DependencyExpression';
import { Path } from '../Path';

describe('Maximum', () => {
  const factual = new Factual(new FactDictionary());

  it('finds the maximum of integers', () => {
    const node = MaximumFactory.create([
      new DependencyNode(
        new DependencyExpression(Path.fromString('/collection/*/int'))
      ),
    ]);
    const collection = {
      '#1': { int: new IntNode(Expression.literal(Result.complete(1))) },
      '#2': { int: new IntNode(Expression.literal(Result.complete(8))) },
      '#3': { int: new IntNode(Expression.literal(Result.complete(5))) },
    };
    const factual = new Factual(new FactDictionary(), {
      '/collection': collection,
    });
    expect(node.get(factual)).toEqual(Result.complete(8));
  });

  it('finds the maximum of dollars', () => {
    const node = MaximumFactory.create([
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
          Expression.literal(Result.complete(Dollar.fromNumber(8.45)))
        ),
      },
      '#3': {
        dollar: new DollarNode(
          Expression.literal(Result.complete(Dollar.fromNumber(5.67)))
        ),
      },
    };
    const factual = new Factual(new FactDictionary(), {
      '/collection': collection,
    });
    expect(node.get(factual).get.toNumber()).toEqual(8.45);
  });
});
