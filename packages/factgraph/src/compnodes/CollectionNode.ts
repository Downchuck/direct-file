import { CompNode, WritableNodeFactory } from './CompNode';
import { Expression } from '../Expression';
import { Path } from '../Path';
import { DependencyExpression } from '../expressions/DependencyExpression';
import { PathItem } from '../PathItem';
import { Graph } from '../Graph';
import { StringNode } from './StringNode';
import { FactDefinition } from '../FactDictionary';
import { CollectExpression } from '../expressions/CollectExpression';
import { Factual } from '../Factual';

export class CollectionNode<T> extends CompNode<T[]> {
  constructor(public readonly itemNode: CompNode<T>) {
    super(new CollectExpression(new DependencyExpression(Path.fromString('*'))));
  }

  public override extract(key: PathItem, factual: Factual): CompNode | undefined {
    if (key.type === 'collection-member' || key.type === 'unknown') {
      return this.itemNode;
    }
    return undefined;
  }
}

export const CollectionNodeFactory: WritableNodeFactory = {
  typeName: 'Collection',

  fromWritableConfig(config: FactDefinition, graph: Graph): CompNode {
    const itemPath = config.path.append(new PathItem('*', 'wildcard'));
    const itemDef = graph.dictionary.getDefinition(itemPath);

    if (!itemDef || !itemDef.writable) {
      // This case can happen for an empty collection that's just been created.
      // We'll default to StringNode, but this may need to be handled more gracefully.
      return new CollectionNode(new StringNode(Expression.literal('')));
    }

    const itemNode = graph.compNodeRegistry.fromWritableConfig(itemDef.writable, graph);
    return new CollectionNode(itemNode as CompNode<any>);
  },
};
