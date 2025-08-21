import { FilterFactory } from '../Filter';
import { DependencyNode } from '../Dependency';
import { TrueFactory } from '../True';
import { Factual } from '../../Factual';
import { FactDictionary } from '../../FactDictionary';
import { Collection } from '../../types/Collection';
import { Result } from '../../types';
import { BooleanNode } from '../BooleanNode';
import { Expression } from '../../Expression';
import { Path } from '../../Path';
import { DependencyExpression } from '../../expressions/DependencyExpression';

describe('Filter', () => {
  const factual = new Factual(new FactDictionary());

  it('filters collections on the value of the Boolean node', () => {
    const node = FilterFactory.create([
      new DependencyNode(
        new DependencyExpression(Path.fromString('/collection/*/bool'))
      ),
    ]);
    const collection = {
      '#1': { bool: new BooleanNode(Expression.literal(Result.complete(true))) },
      '#2': {
        bool: new BooleanNode(Expression.literal(Result.complete(false))),
      },
    };
    const factual = new Factual(new FactDictionary(), {
      '/collection': collection,
    });
    expect(node.get(factual)).toEqual(
      Result.complete(new Collection(['#1']))
    );
  });
});
