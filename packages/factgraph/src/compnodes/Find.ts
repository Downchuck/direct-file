import {
  CompNode,
  CompNodeFactory,
  compNodeRegistry,
} from './CompNode';
import { CollectionItemNode } from './CollectionItemNode';
import { BooleanNode } from './BooleanNode';
import {
  CollectOperator,
  applyCollect,
  explainCollect,
} from '../operators/CollectOperator';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { CollectExpression } from '../expressions/CollectExpression';
import { Result } from '../types';
import { Thunk } from '../Thunk';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';
import { Path } from '../Path';
import { CollectionItem } from '../types/CollectionItem';

class FindOperator implements CollectOperator<CollectionItem, boolean> {
  apply(
    vect: [CollectionItem, Thunk<Result<boolean>>][]
  ): Result<CollectionItem> {
    const item = vect.find(([_item, thunk]) =>
      thunk.get().getOrElse(false)
    );
    return new Result(item ? item[0] : undefined);
  }

  explain(
    path: Path,
    child: Expression<boolean>,
    factual: Factual
  ): Explanation {
    return explainCollect(path, child, factual);
  }
}

const findOperator = new FindOperator();

export class FindFactory implements CompNodeFactory {
  readonly typeName = 'Find';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const path = new Path(e.options.path);
    const child = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      factual,
      factDictionary
    );

    if (!(child instanceof BooleanNode)) {
      throw new Error('Find child must be a BooleanNode');
    }

    const collectionItem = factual.get(path.wildcard(), 0);
    if (!collectionItem.isComplete()) {
      throw new Error(
        `cannot find fact at path '${path}' from '${factual.path}'`
      );
    }

    const cnBuilder = (item: Factual) =>
      compNodeRegistry.fromDerivedConfig(
        e.children[0],
        item,
        factDictionary
      ) as BooleanNode;

    const expression = new CollectExpression(
      path,
      (item: Factual) => cnBuilder(item).expr,
      findOperator
    );

    return new CollectionItemNode(expression, new Path(e.options.path));
  }
}

compNodeRegistry.register(new FindFactory());
