import { CompNode, CompNodeFactory } from './CompNode';
import { IntNode } from './IntNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { DayNode } from './DayNode';
import { BooleanNode } from './BooleanNode';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { Day } from '../types/Day';
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

class LessThanBinaryOperator<L, R> implements BinaryOperator<boolean, L, R> {
  constructor(private readonly op: (lhs: L, rhs: R) => boolean) {}
  operation(lhs: L, rhs: R): boolean {
    return this.op(lhs, rhs);
  }
  apply(lhs: Result<L>, rhs: Result<R>): Result<boolean> {
    return applyBinary(this, lhs, rhs);
  }
  explain(
    lhs: Expression<L>,
    rhs: Expression<R>,
    factual: Factual
  ): Explanation {
    return explainBinary(lhs, rhs, factual);
  }
}

const intLt = (x: number, y: number) => x < y;
const dollarLt = (x: Dollar, y: Dollar) => x.lt(y);
const rationalLt = (x: Rational, y: Rational) => x.lt(y);
const dayLt = (x: Day, y: Day) => x.toDate() < y.toDate();

const intIntBinaryOperator = new LessThanBinaryOperator(intLt);
const dollarDollarBinaryOperator = new LessThanBinaryOperator(dollarLt);
const rationalRationalBinaryOperator = new LessThanBinaryOperator(rationalLt);
const dayDayBinaryOperator = new LessThanBinaryOperator(dayLt);

const create = (lhs: CompNode, rhs: CompNode): CompNode => {
  if (lhs instanceof IntNode && rhs instanceof IntNode) {
    return new BooleanNode(
      new BinaryExpression(lhs.expr, rhs.expr, intIntBinaryOperator)
    );
  }
  if (lhs instanceof DollarNode && rhs instanceof DollarNode) {
    return new BooleanNode(
      new BinaryExpression(lhs.expr, rhs.expr, dollarDollarBinaryOperator)
    );
  }
  if (lhs instanceof RationalNode && rhs instanceof RationalNode) {
    return new BooleanNode(
      new BinaryExpression(
        lhs.expr,
        rhs.expr,
        rationalRationalBinaryOperator
      )
    );
  }
  if (lhs instanceof DayNode && rhs instanceof DayNode) {
    return new BooleanNode(
      new BinaryExpression(lhs.expr, rhs.expr, dayDayBinaryOperator)
    );
  }
  throw new Error(
    `cannot compare a ${lhs.constructor.name} and a ${rhs.constructor.name}`
  );
}

export const LessThanFactory: CompNodeFactory = {
  typeName: 'LessThan',

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
    return create(lhs, rhs);
  }
};
