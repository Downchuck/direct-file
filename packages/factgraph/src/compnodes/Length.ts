import { CompNode, CompNodeFactory } from './CompNode';
import { StringNode } from './StringNode';
import { IntNode } from './IntNode';
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

class LengthOperator implements UnaryOperator<number, string> {
  operation(x: string): number {
    return x.length;
  }
  apply(x: Result<string>): Result<number> {
    return applyUnary(this, x);
  }
  explain(x: Expression<string>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

const lengthOperator = new LengthOperator();

export const LengthFactory: CompNodeFactory = {
  typeName: 'Length',

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    const node = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      graph
    );
    if (!(node instanceof StringNode)) {
      throw new Error('Length can only operate on a StringNode');
    }
    return this.create([node]);
  },

  create(nodes: CompNode[]): IntNode {
    const node = nodes[0];
    if (!(node instanceof StringNode)) {
      throw new Error('Length can only operate on a StringNode');
    }
    return new IntNode(new UnaryExpression(node.expr, lengthOperator));
  },
};
