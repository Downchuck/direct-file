import { CompNode, DerivedNodeFactory } from './CompNode';
import { IntNode } from './IntNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { DayNode } from './DayNode';
import { BooleanNode } from './BooleanNode';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { Day } from '../types/Day';
import { BinaryOperator } from '../operators/BinaryOperator';
import { applyBinary, explainBinary } from '../operators/BinaryOperatorHelpers';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';

class LessThanOrEqualBinaryOperator<L, R> implements BinaryOperator<boolean, L, R> {
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

const intLte = (x: number, y: number) => x <= y;
const dollarLte = (x: Dollar, y: Dollar) => x.lte(y);
const rationalLte = (x: Rational, y: Rational) => x.lte(y);
const dayLte = (x: Day, y: Day) => x.toDate() <= y.toDate();

const intIntBinaryOperator = new LessThanOrEqualBinaryOperator(intLte);
const dollarDollarBinaryOperator = new LessThanOrEqualBinaryOperator(dollarLte);
const rationalRationalBinaryOperator = new LessThanOrEqualBinaryOperator(rationalLte);
const dayDayBinaryOperator = new LessThanOrEqualBinaryOperator(dayLte);

export const LessThanOrEqualFactory: DerivedNodeFactory = {
  typeName: 'LessThanOrEqual',
  fromDerivedConfig(e: any, graph: Graph, children: CompNode[]): CompNode {
    if (children.length !== 2) {
      throw new Error(`LessThanOrEqual expects 2 children, but got ${children.length}`);
    }
    const [lhs, rhs] = children;

    if (lhs instanceof IntNode && rhs instanceof IntNode) {
      return new BooleanNode(new BinaryExpression(intIntBinaryOperator));
    }
    if (lhs instanceof DollarNode && rhs instanceof DollarNode) {
      return new BooleanNode(new BinaryExpression(dollarDollarBinaryOperator));
    }
    if (lhs instanceof RationalNode && rhs instanceof RationalNode) {
      return new BooleanNode(new BinaryExpression(rationalRationalBinaryOperator));
    }
    if (lhs instanceof DayNode && rhs instanceof DayNode) {
      return new BooleanNode(new BinaryExpression(dayDayBinaryOperator));
    }
    throw new Error(
      `cannot compare a ${lhs.constructor.name} and a ${rhs.constructor.name}`
    );
  }
};
