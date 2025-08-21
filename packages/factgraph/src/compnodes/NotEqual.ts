import { CompNode, CompNodeFactory } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { BinaryOperator } from '../operators/BinaryOperator';
import {
  applyBinary,
  explainBinary,
} from '../operators/BinaryOperatorHelpers';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';
import { compNodeRegistry } from './registry';

class NotEqualBinaryOperator implements BinaryOperator<boolean, any, any> {
  operation(lhs: any, rhs: any): boolean {
    if (lhs && typeof lhs.equals === 'function') {
      return !lhs.equals(rhs);
    }
    return lhs !== rhs;
  }
  apply(lhs: Result<any>, rhs: Result<any>): Result<boolean> {
    return applyBinary(this, lhs, rhs);
  }
  explain(
    lhs: Expression<any>,
    rhs: Expression<any>,
    factual: Factual
  ): Explanation {
    return explainBinary(lhs, rhs, factual);
  }
}

const notEqualOperator = new NotEqualBinaryOperator();

export const NotEqualFactory: CompNodeFactory = {
  typeName: 'NotEqual',

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
    if (lhs.constructor.name !== rhs.constructor.name) {
      throw new Error(
        `cannot compare a ${lhs.constructor.name} and a ${rhs.constructor.name}`
      );
    }
    return new BooleanNode(
      new BinaryExpression(lhs.expr, rhs.expr, notEqualOperator)
    );
  },
};
