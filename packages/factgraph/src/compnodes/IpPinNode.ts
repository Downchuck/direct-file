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
import { compNodeRegistry } from './registry';

// The IpPin type is just a string
export type IpPin = string;

export class IpPinNode extends CompNode {
  constructor(public readonly expr: Expression<IpPin>) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fromExpression(expr: Expression<IpPin>): CompNode {
    return new IpPinNode(expr);
  }
}

class IpPinOperator implements UnaryOperator<IpPin, string> {
  operation(x: string): IpPin {
    if (x.match(/^\d{6}$/)) {
      return x;
    }
    throw new Error('Invalid IP PIN format');
  }
  apply(x: Result<string>): Result<IpPin> {
    return applyUnary(this, x);
  }
  explain(x: Expression<string>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

const ipPinOperator = new IpPinOperator();

export const IpPinNodeFactory: CompNodeFactory & WritableNodeFactory = {
  typeName: 'IpPin',

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
    return new IpPinNode(Expression.writable(Result.incomplete()));
  },

  create(nodes: CompNode[]): CompNode {
    const child = nodes[0];
    if (!(child instanceof StringNode)) {
      throw new Error('IpPinNode child must be a StringNode');
    }
    return new IpPinNode(new UnaryExpression(child.expr, ipPinOperator));
  },
};
