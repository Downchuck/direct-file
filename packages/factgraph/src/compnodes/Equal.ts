import { CompNode, DerivedNodeFactory } from './CompNode';
import { IntNode } from './IntNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { DayNode } from './DayNode';
import { BooleanNode } from './BooleanNode';
import { StringNode } from './StringNode';
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

class EqualBinaryOperator<T> implements BinaryOperator<boolean, T, T> {
  constructor(private readonly op: (lhs: T, rhs: T) => boolean) {}
  operation(lhs: T, rhs: T): boolean {
    return this.op(lhs, rhs);
  }
  apply(lhs: Result<T>, rhs: Result<T>): Result<boolean> {
    return applyBinary(this, lhs, rhs);
  }
  explain(
    lhs: Expression<T>,
    rhs: Expression<T>,
    factual: Factual
  ): Explanation {
    return explainBinary(lhs, rhs, factual);
  }
}

const intEq = (x: number, y: number) => x === y;
const stringEq = (x: string, y: string) => x === y;
const dollarEq = (x: Dollar, y: Dollar) => x.equals(y);
const rationalEq = (x: Rational, y: Rational) => x.equals(y);
const dayEq = (x: Day, y: Day) => x.equals(y);
const boolEq = (x: boolean, y: boolean) => x === y;

const intIntBinaryOperator = new EqualBinaryOperator(intEq);
const stringStringBinaryOperator = new EqualBinaryOperator(stringEq);
const dollarDollarBinaryOperator = new EqualBinaryOperator(dollarEq);
const rationalRationalBinaryOperator = new EqualBinaryOperator(rationalEq);
const dayDayBinaryOperator = new EqualBinaryOperator(dayEq);
const boolBoolBinaryOperator = new EqualBinaryOperator(boolEq);

export const EqualFactory: DerivedNodeFactory = {
  typeName: 'Equal',
  fromDerivedConfig(e: any, graph: Graph, children: CompNode[]): CompNode {
    if (children.length !== 2) {
      throw new Error(`Equal expects 2 children, but got ${children.length}`);
    }
    const [lhs, rhs] = children;

    if (lhs instanceof IntNode && rhs instanceof IntNode) {
      return new BooleanNode(new BinaryExpression(intIntBinaryOperator));
    }
    if (lhs instanceof StringNode && rhs instanceof StringNode) {
        return new BooleanNode(new BinaryExpression(stringStringBinaryOperator));
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
    if (lhs instanceof BooleanNode && rhs instanceof BooleanNode) {
        return new BooleanNode(new BinaryExpression(boolBoolBinaryOperator));
    }
    throw new Error(
      `cannot compare a ${lhs.constructor.name} and a ${rhs.constructor.name}`
    );
  }
};
