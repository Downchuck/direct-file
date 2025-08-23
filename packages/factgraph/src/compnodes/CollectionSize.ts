import { CompNode, DerivedNodeFactory } from './CompNode';
import { IntNode } from './IntNode';
import { CollectionNode } from './CollectionNode';
import { UnaryOperator } from '../operators/UnaryOperator';
import { UnaryExpression } from '../expressions/UnaryExpression';
import { Graph } from '../Graph';

export const CollectionSizeFactory: DerivedNodeFactory = {
  typeName: 'CollectionSize',
  fromDerivedConfig(e: any, graph: Graph, children: CompNode[]): CompNode {
    if (children.length !== 1) {
      throw new Error(`CollectionSize expects 1 child, but got ${children.length}`);
    }
    const child = children[0];
    if (!(child instanceof CollectionNode)) {
        throw new Error('CollectionSize child must be a CollectionNode');
    }

    const operator = new UnaryOperator((c: any[]) => c.length);

    return new IntNode(new UnaryExpression(operator));
  },
};
