import { Expression } from '../expressions';
import { CompNode, CompNodeFactory, WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { Result } from '../types';
import { StringNode } from './StringNode';
import { UnaryOperator } from '../operators/UnaryOperator';
import {
  applyUnary,
  explainUnary,
} from '../operators/UnaryOperatorHelpers';
import { Factual } from '../Factual';
import { Explanation } from '../Explanation';
import { UnaryExpression } from '../expressions/UnaryExpression';
import { compNodeRegistry } from './register-factories';

// The Pin type is just a string
export type Pin = string;

export class PinNode extends CompNode {
  constructor(public readonly expr: Expression<Pin>) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fromExpression(expr: Expression<Pin>): CompNode {
    return new PinNode(expr);
  }
}

class PinOperator implements UnaryOperator<Pin, string> {
  operation(x: string): Pin {
    if (x.match(/^\d{5}$/)) {
      return x;
    }
    throw new Error('Invalid PIN format');
  }
  apply(x: Result<string>): Result<Pin> {
    return applyUnary(this, x);
  }
  explain(x: Expression<string>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

const pinOperator = new PinOperator();

export const PinNodeFactory: CompNodeFactory & WritableNodeFactory = {
  typeName: 'Pin',

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    const child = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      graph
    );
    return this.create([child]);
  },

  fromWritableConfig(): CompNode {
    return new PinNode(Expression.writable(Result.incomplete()));
  },

  create(nodes: CompNode[]): CompNode {
    const child = nodes[0];
    if (!(child instanceof StringNode)) {
      throw new Error('PinNode child must be a StringNode');
    }
    return new PinNode(new UnaryExpression(child.expr, pinOperator));
  },
};
