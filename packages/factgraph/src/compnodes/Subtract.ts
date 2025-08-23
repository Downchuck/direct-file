import { CompNode, DerivedNodeFactory } from './CompNode';
import { IntNode } from './IntNode';
import { BinaryOperator } from '../operators/BinaryOperator';
import { applyBinary, explainBinary } from '../operators/BinaryOperatorHelpers';
import { Factual } from '../Factual';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { Graph } from '../Graph';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';

class SubtractBinaryOperator implements BinaryOperator<number, number, number> {
  operation(lhs: number, rhs: number): number {
    return lhs - rhs;
  }
  apply(lhs: Result<number>, rhs: Result<number>): Result<number> {
    return applyBinary(this, lhs, rhs);
  }
  explain(
    lhs: Expression<number>,
    rhs: Expression<number>,
    factual: Factual
  ): Explanation {
    return explainBinary(lhs, rhs, factual);
  }
}

const intIntBinaryOperator = new SubtractBinaryOperator();

export const SubtractFactory: DerivedNodeFactory = {
  typeName: 'Subtract',
  fromDerivedConfig(e: any, graph: Graph, children: CompNode[]): CompNode {
    if (children.length !== 2) {
      throw new Error(`Subtract expects 2 children, but got ${children.length}`);
    }
    const [lhs, rhs] = children;

    if (lhs instanceof IntNode && rhs instanceof IntNode) {
      return new IntNode(new BinaryExpression(intIntBinaryOperator));
    }
    throw new Error(`cannot subtract a ${rhs.constructor.name} from a ${lhs.constructor.name}`);
  }
};
