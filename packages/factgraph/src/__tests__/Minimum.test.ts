import { MinimumFactory } from '../compnodes/Minimum';
import { DependencyNode } from '../compnodes/Dependency';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { IntNode } from '../compnodes/IntNode';
import { Expression } from '../Expression';
import { Result } from '../types';
import { DependencyExpression } from '../expressions/DependencyExpression';
import { Path } from '../Path';

describe('Minimum', () => {
  it('finds the minimum of integers', () => {
    const node = MinimumFactory.create([
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
    expect(node.get(factual)).toEqual(Result.complete(1));
  });
});
