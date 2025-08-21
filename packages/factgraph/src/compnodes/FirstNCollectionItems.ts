import { CompNode, CompNodeFactory } from './CompNode';
import { CollectionNode } from './CollectionNode';
import { IntNode } from './IntNode';
import { BinaryOperator, applyBinary, explainBinary } from '../operators/BinaryOperator';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { compNodeRegistry } from './registry';
import { Collection } from '../types/Collection';

class FirstNCollectionItemsOperator implements BinaryOperator<Collection, Collection, number> {
  operation(collection: Collection, n: number): Collection {
    return new Collection(collection.values.slice(0, n));
  }
  apply(lhs: Result<Collection>, rhs: Result<number>): Result<Collection> {
    return applyBinary(this, lhs, rhs);
  }
  explain(
    lhs: Expression<Collection>,
    rhs: Expression<number>,
    factual: Factual
  ): Explanation {
    return explainBinary(lhs, rhs, factual);
  }
}

const operator = new FirstNCollectionItemsOperator();

export const FirstNCollectionItemsFactory: CompNodeFactory = {
  typeName: 'FirstNCollectionItems',

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    const lhs = compNodeRegistry.fromDerivedConfig(
      e.children.find((c: any) => c.key === 'Left').children[0],
      graph
    );
    const rhs = compNodeRegistry.fromDerivedConfig(
      e.children.find((c: any) => c.key === 'Right').children[0],
      graph
    );
    return this.create([lhs, rhs]);
  },

  create(nodes: CompNode[]): CompNode {
    const [lhs, rhs] = nodes;
    if (lhs instanceof CollectionNode && rhs instanceof IntNode) {
      return new CollectionNode(new BinaryExpression(lhs.expr, rhs.expr, operator));
    }
    throw new Error(
      `cannot get the first N items from a ${lhs.constructor.name} with a ${rhs.constructor.name}`
    );
  },
};
