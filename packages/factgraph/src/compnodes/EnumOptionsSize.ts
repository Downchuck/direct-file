import { CompNode, CompNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { UnaryOperator } from '../operators';
import { EnumOptionsNode } from './EnumOptionsNode';
import { IntNode } from './IntNode';
import { compNodeRegistry } from './register-factories';
import { UnaryExpression } from '../expressions/UnaryExpression';
import {
  applyUnary,
  explainUnary,
} from '../operators/UnaryOperatorHelpers';
import { Factual } from '../Factual';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';
import { Result } from '../types';

class EnumOptionsSizeOperator implements UnaryOperator<number, string[]> {
  operation(value: string[]): number {
    return value.length;
  }
  apply(x: Result<string[]>): Result<number> {
    return applyUnary(this, x);
  }
  explain(x: Expression<string[]>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

const operator = new EnumOptionsSizeOperator();

export const EnumOptionsSizeFactory: CompNodeFactory = {
  typeName: 'EnumOptionsSize',

  fromDerivedConfig(
    e: { children: any[] },
    graph: Graph
  ): CompNode {
    const child = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      graph
    ) as EnumOptionsNode;
    return this.create([child]);
  },

  create(nodes: CompNode[]): CompNode {
    const child = nodes[0];
    if (!(child instanceof EnumOptionsNode)) {
      throw new Error('EnumOptionsSize child must be an EnumOptionsNode');
    }
    return new IntNode(new UnaryExpression(child.expr, operator));
  },
};
