import {
  CompNode,
  CompNodeFactory,
} from './CompNode';
import { CollectionItemNode } from './CollectionItemNode';
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
import { CollectionItem } from '../types/CollectionItem';
import { compNodeRegistry } from './register-factories';

class FindOperator implements CollectOperator<CollectionItem<any>, boolean> {
  apply(
    vect: [CollectionItem<any>, Thunk<Result<boolean>>][]
  ): Result<CollectionItem<any>> {
    const item = vect.find(([_item, thunk]) =>
      thunk.get.getOrElse(false)
    );
    return item ? Result.complete(item[0]) : Result.incomplete();
  }

  explain(
    path: Path,
    child: Expression<boolean>,
    factual: Factual
  ): Explanation {
    return new ConstantExplanation();
  }
}

const findOperator = new FindOperator();

export const FindFactory: CompNodeFactory = {
  typeName: 'Find',

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
      throw new Error('Find child must be a BooleanNode');
    }

    const cnBuilder = (item: Factual) =>
      compNodeRegistry.fromDerivedConfig(
        e.children[0],
        item.graph
      ) as BooleanNode;

    const expression = new CollectExpression(
      path,
      (item: Factual) => cnBuilder(item).expr,
      findOperator
    );

    return new CollectionItemNode(expression);
  },
};
