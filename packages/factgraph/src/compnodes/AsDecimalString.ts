import { CompNode, DerivedNodeFactory } from './CompNode';
import { StringNode } from './StringNode';
import { RationalNode } from './RationalNode';
import { UnaryOperator } from '../operators/UnaryOperator';
import { UnaryExpression } from '../expressions/UnaryExpression';
import { Graph } from '../Graph';
import { Rational } from '../types';

export const AsDecimalStringFactory: DerivedNodeFactory = {
  typeName: 'AsDecimalString',
  fromDerivedConfig(e: any, graph: Graph, children: CompNode[]): CompNode {
    if (children.length !== 1) {
      throw new Error(`AsDecimalString expects 1 child, but got ${children.length}`);
    }
    const child = children[0];
    if (!(child instanceof RationalNode)) {
        throw new Error('AsDecimalString child must be a RationalNode');
    }

    const scale = e.scale ?? 2;
    const operator = new UnaryOperator((r: Rational) => r.toDecimal(scale));

    return new StringNode(new UnaryExpression(operator));
  },
};
