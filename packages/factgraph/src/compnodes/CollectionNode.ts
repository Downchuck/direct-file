import { Expression, SwitchExpression } from '../Expression';
import { Path } from '../Path';
import { Collection } from '../types/Collection';
import { CompNode } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { PathItem } from '../PathItem';
import { CollectionItemNode } from './CollectionItemNode';
import { CollectionItem } from '../types/CollectionItem';
import { WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { Result } from '../types';
import { DependencyExpression } from '../expressions/DependencyExpression';

export class CollectionNode extends CompNode {
  public readonly expr: Expression<Collection>;
  public readonly alias?: Path;

  constructor(expr: Expression<Collection>, alias?: Path) {
    super();
    this.expr = expr;
    this.alias = alias;
  }

  public override switch(cases: [BooleanNode, CompNode][]): CompNode {
    const aliasesMatch = cases.every(
      ([, node]) => (node as CollectionNode).alias?.toString() === this.alias?.toString()
    );

    if (!aliasesMatch) {
      throw new Error(
        'collections in a <Switch> must reference the same collection'
      );
    }

    const switchCases = cases.map(
      ([boolNode, collNode]) =>
        [boolNode.expr, (collNode as CollectionNode).expr] as [
          Expression<boolean>,
          Expression<Collection>
        ]
    );

    return new CollectionNode(new SwitchExpression(switchCases), this.alias);
  }

  public override dependency(path: Path): CompNode {
    const newAlias = this.alias ?? path;
    return new CollectionNode(new DependencyExpression(path), newAlias);
  }

  protected fromExpression(expr: Expression<Collection>): CompNode {
    throw new Error('cannot create a Collection from an expression');
  }

  public override extract(key: PathItem): CompNode | undefined {
    if (key.type === 'collection-member') {
      return new CollectionItemNode(
        Expression.literal(Result.complete(new CollectionItem(key.key))),
        undefined
      );
    }
    if (key.type === 'unknown') {
      return new CollectionItemNode(Expression.literal(Result.incomplete()), undefined);
    }
    return undefined;
  }
}

export class CollectionNodeFactory implements WritableNodeFactory {
  readonly typeName = 'Collection';

  fromWritableConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    return new CollectionNode(
      Expression.writable(Result.complete(new Collection([]))),
      undefined
    );
  }
}
