import { CompNode, CompNodeFactory } from './CompNode';
import { CollectionNode } from './CollectionNode';
import { DependencyNode } from './Dependency';
import { IntNode } from './IntNode';
import { UnaryExpression } from '../expressions/UnaryExpression';
import { Collection } from '../types/Collection';
import { UnaryOperator } from '../operators/UnaryOperator';
import {
  applyUnary,
  explainUnary,
} from '../operators/UnaryOperatorHelpers';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { getChildNode } from '../util/getChildNode';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';

const CollectionSizeOperator: UnaryOperator<number, Collection> = {
  operation(x: Collection): number {
    return x.values.length;
  },

  apply(x: Result<Collection>): Result<number> {
    return applyUnary(this, x);
  },

  explain(x: Expression<Collection>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  },
};

export const CollectionSizeFactory: CompNodeFactory = {
  typeName: 'CollectionSize',
  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    const childNode = getChildNode(e, graph);
    return this.create([childNode]);
  },

  create(nodes: CompNode[]): CompNode {
    const childNode = nodes[0];
    if (childNode instanceof CollectionNode || childNode instanceof DependencyNode) {
      return new IntNode(
        new UnaryExpression(childNode.expr, CollectionSizeOperator)
      );
    }
    throw new Error(`invalid child type: ${childNode.constructor.name}`);
  },
};
