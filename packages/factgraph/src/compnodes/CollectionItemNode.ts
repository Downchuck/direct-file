import { Expression, SwitchExpression } from '../Expression';
import { Path } from '../Path';
import { CollectionItem } from '../types/CollectionItem';
import { CompNode, compNodeRegistry } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { WritableNodeFactory } from './WritableNodeFactory';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { DependencyExpression } from '../expressions/DependencyExpression';
import { Result } from '../types';

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
    return new CollectionItemNode(
      Expression.writable(Result.incomplete()),
      Path.fromString(e.collectionItemAlias)
    );
  }
}

compNodeRegistry.register(new CollectionItemNodeFactory());
