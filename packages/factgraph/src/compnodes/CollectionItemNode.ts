import { Expression, SwitchExpression } from '../Expression';
import { Path } from '../Path';
import { CollectionItem } from '../types/CollectionItem';
import { CompNode, compNodeRegistry } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { WritableNodeFactory } from './WritableNodeFactory';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { DependencyExpression } from '../expressions/DependencyExpression';

export class CollectionItemNode extends CompNode {
  public readonly expr: Expression<CollectionItem>;
  public readonly alias?: Path;

  constructor(expr: Expression<CollectionItem>, alias?: Path) {
    super();
    this.expr = expr;
    this.alias = alias;
  }

  public override switch(cases: [BooleanNode, CompNode][]): CompNode {
    const aliasesMatch = cases.every(
      ([, node]) => (node as CollectionItemNode).alias?.toString() === this.alias?.toString()
    );

    if (!aliasesMatch) {
      throw new Error(
        'collection items in a <Switch> must reference the same collection'
      );
    }

    const switchCases = cases.map(
      ([boolNode, itemNode]) =>
        [boolNode.expr, (itemNode as CollectionItemNode).expr] as [
          Expression<boolean>,
          Expression<CollectionItem>
        ]
    );

    return new CollectionItemNode(new SwitchExpression(switchCases), this.alias);
  }

  public override dependency(path: Path): CompNode {
    const newAlias = this.alias ?? path;
    return new CollectionItemNode(new DependencyExpression(path), newAlias);
  }

  protected fromExpression(expr: Expression<CollectionItem>): CompNode {
    return new CollectionItemNode(expr, this.alias);
  }
}

class CollectionItemNodeFactory implements WritableNodeFactory {
  readonly typeName = 'CollectionItem';

  fromWritableConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    // In the scala code, this is Expression.Writable(classOf[CollectionItem])
    // and it gets a path from e.collectionItemAlias.get
    // Not sure how to handle that here yet.
    // For now, I'll make it a dependency on the root path.
    return new CollectionItemNode(
      new DependencyExpression(Path.fromString(e.collectionItemAlias)),
      Path.fromString(e.collectionItemAlias)
    );
  }
}

compNodeRegistry.register(new CollectionItemNodeFactory());
