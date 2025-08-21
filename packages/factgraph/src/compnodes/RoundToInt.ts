import { CompNode, CompNodeFactory } from './CompNode';
import { DollarNode } from './DollarNode';
import { IntNode } from './IntNode';
import { Dollar } from '../types/Dollar';
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

class RoundToIntOperator implements UnaryOperator<number, Dollar> {
  operation(x: Dollar): number {
    return Math.round(x.round().toNumber());
  }
  apply(x: Result<Dollar>): Result<number> {
    return applyUnary(this, x);
  }
  explain(x: Expression<Dollar>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

const roundToIntOperator = new RoundToIntOperator();

export const RoundToIntFactory: CompNodeFactory = {
  typeName: 'RoundToInt',

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    const amount = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      graph
    );
    if (!(amount instanceof DollarNode)) {
      throw new Error('RoundToInt can only operate on a DollarNode');
    }
    return this.create([amount]);
  },

  create(nodes: CompNode[]): IntNode {
    const amount = nodes[0];
    if (!(amount instanceof DollarNode)) {
      throw new Error('RoundToInt can only operate on a DollarNode');
    }
    return new IntNode(new UnaryExpression(amount.expr, roundToIntOperator));
  },
};
