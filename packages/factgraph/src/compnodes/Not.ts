import { CompNode, CompNodeFactory } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { UnaryOperator } from '../operators/UnaryOperator';
import {
  applyUnary,
  explainUnary,
} from '../operators/UnaryOperatorHelpers';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { UnaryExpression } from '../expressions/UnaryExpression';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';
import { compNodeRegistry } from './registry';

class NotOperator implements UnaryOperator<boolean, boolean> {
  operation(x: boolean): boolean {
    return !x;
  }
  apply(x: Result<boolean>): Result<boolean> {
    return applyUnary(this, x);
  }
  explain(x: Expression<boolean>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

const notOperator = new NotOperator();

export const NotFactory: CompNodeFactory = {
  typeName: 'Not',

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    const childNode = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      graph
    );
    if (!(childNode instanceof BooleanNode)) {
      throw new Error('Not can only operate on a BooleanNode');
    }
    return this.create([childNode]);
  },

  create(nodes: CompNode[]): CompNode {
    const node = nodes[0];
    if (!(node instanceof BooleanNode)) {
      throw new Error('Not can only operate on a BooleanNode');
    }
    return new BooleanNode(new UnaryExpression(node.expr, notOperator));
  },
};
