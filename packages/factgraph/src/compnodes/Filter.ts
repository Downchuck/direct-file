import {
  CompNode,
  CompNodeFactory,
} from './CompNode';
import { CollectionNode } from './CollectionNode';
import { BooleanNode } from './BooleanNode';
import { CollectOperator } from '../operators/CollectOperator';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { CollectExpression } from '../expressions/CollectExpression';
import { Result } from '../types';
import { Thunk } from '../Thunk';
import { Explanation, ConstantExplanation } from '../Explanation';
import { Expression } from '../Expression';
import { Path } from '../Path';
import { Collection } from '../types/Collection';
import { CollectionItem } from '../types/CollectionItem';
import { compNodeRegistry } from './registry';

class FilterOperator implements CollectOperator<Collection<any>, boolean> {
  apply(
    vect: [CollectionItem<any>, Thunk<Result<boolean>>][]
  ): Result<Collection<any>> {
    const results = vect.map(([_, thunk]) => thunk.get);
    const bools = results.map((r) => r.getOrElse(false));
    const filteredIds = vect
      .filter((_, i) => bools[i])
      .map(([item, _]) => item.id);

    const complete = results.every((r) => r.isComplete);

    return complete
      ? Result.complete(new Collection(filteredIds))
      : Result.incomplete();
  }

  explain(
    path: Path,
    child: Expression<boolean>,
    factual: Factual
  ): Explanation {
    return new ConstantExplanation();
  }
}

const filterOperator = new FilterOperator();

export const FilterFactory: CompNodeFactory = {
  typeName: 'Filter',

  fromDerivedConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    const path = Path.fromString(e.options.path);
    const child = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      graph
    );

    if (!(child instanceof BooleanNode)) {
      throw new Error('Filter child must be a BooleanNode');
    }

    const cnBuilder = (item: Factual) =>
      compNodeRegistry.fromDerivedConfig(
        e.children[0],
        item.graph
      ) as BooleanNode;

    const expression = new CollectExpression(
      path,
      (item: Factual) => cnBuilder(item).expr,
      filterOperator
    );

    return new CollectionNode(expression);
  },
};
