import { CompNode, DerivedNodeFactory } from './CompNode';
import { StringNode } from './StringNode';
import { EnumNode } from './EnumNode';
import { EmailAddressNode } from './EmailAddressNode';
import { DollarNode } from './DollarNode';
import { EinNode } from './EinNode';
import { TinNode } from './TinNode';
import { UnaryOperator } from '../operators/UnaryOperator';
import { UnaryExpression } from '../expressions/UnaryExpression';
import { Graph } from '../Graph';
import { Enum, EmailAddress, Dollar, Ein, Tin } from '../types';

export const AsStringFactory: DerivedNodeFactory = {
  typeName: 'AsString',
  fromDerivedConfig(e: any, graph: Graph, children: CompNode[]): CompNode {
    if (children.length !== 1) {
      throw new Error(`AsString expects 1 child, but got ${children.length}`);
    }
    const child = children[0];

    if (child instanceof EnumNode) {
        return new StringNode(new UnaryExpression(new UnaryOperator((e: Enum) => e.getValue())));
    }
    if (child instanceof EmailAddressNode) {
        return new StringNode(new UnaryExpression(new UnaryOperator((e: EmailAddress) => e.toString())));
    }
    if (child instanceof DollarNode) {
        return new StringNode(new UnaryExpression(new UnaryOperator((d: Dollar) => d.toString())));
    }
    if (child instanceof EinNode) {
        return new StringNode(new UnaryExpression(new UnaryOperator((e: Ein) => e.toString())));
    }
    if (child instanceof TinNode) {
        return new StringNode(new UnaryExpression(new UnaryOperator((t: Tin) => t.toString())));
    }

    throw new Error(`cannot execute AsString on a ${child.constructor.name}`);
  },
};
