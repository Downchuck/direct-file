import { CompNode, CompNodeFactory } from './CompNode';
import { CollectionNode } from './CollectionNode';
import { IntNode } from './IntNode';
import { StringNode } from './StringNode';
import { BinaryOperator } from '../operators/BinaryOperator';
import {
  applyBinary,
  explainBinary,
} from '../operators/BinaryOperatorHelpers';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { compNodeRegistry } from './registry';
import { Collection } from '../types/Collection';

class IndexOfOperator implements BinaryOperator<number, Collection, string> {
  operation(collection: Collection, value: string): number {
    return collection.values.indexOf(value);
  }
  apply(lhs: Result<Collection>, rhs: Result<string>): Result<number> {
    return applyBinary(this, lhs, rhs);
  }
  explain(
    lhs: Expression<Collection>,
    rhs: Expression<string>,
    factual: Factual
  ): Explanation {
    return explainBinary(lhs, rhs, factual);
  }
}

const operator = new IndexOfOperator();

export const IndexOfFactory: CompNodeFactory = {
  typeName: 'IndexOf',

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
    if (lhs instanceof CollectionNode && rhs instanceof StringNode) {
      return new IntNode(new BinaryExpression(lhs.expr, rhs.expr, operator));
    }
    throw new Error(
      `cannot get the index of a ${rhs.constructor.name} in a ${lhs.constructor.name}`
    );
  },
};
