import { CompNode, CompNodeFactory } from './CompNode';
import { IntNode } from './IntNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { DayNode } from './DayNode';
import { DaysNode } from './DaysNode';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { Day } from '../types/Day';
import { Days } from '../types/Days';
import { BinaryOperator } from '../operators/BinaryOperator';
import {
  applyBinary,
  explainBinary,
} from '../operators/BinaryOperatorHelpers';
import { ReduceOperator } from '../operators/ReduceOperator';
import {
  applyReduce,
  explainReduce,
} from '../operators/ReduceOperatorHelpers';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { ReduceExpression } from '../expressions/ReduceExpression';
import { Result } from '../types';
import { Thunk } from '../Thunk';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';
import { compNodeRegistry } from './registry';

class SubtractReduceOperator<A> implements ReduceOperator<A> {
  constructor(private readonly minus: (x: A, y: A) => A) {}
  reduce(x: A, y: A): A {
    return this.minus(x, y);
  }
  apply(head: Result<A>, tail: Thunk<Result<A>>[]): Result<A> {
    return applyReduce(this, head, tail);
  }
  explain(xs: Expression<A>[], factual: Factual): Explanation {
    return explainReduce(xs, factual);
  }
}

const intMinus = (x: number, y: number) => x - y;
const dollarMinus = (x: Dollar, y: Dollar) => x.sub(y);
const rationalMinus = (x: Rational, y: Rational) => x.sub(y);

const intReduceOperator = new SubtractReduceOperator(intMinus);
const dollarReduceOperator = new SubtractReduceOperator(dollarMinus);
const rationalReduceOperator = new SubtractReduceOperator(rationalMinus);

class SubtractBinaryOperator<A, L, R> implements BinaryOperator<A, L, R> {
  constructor(private readonly op: (lhs: L, rhs: R) => A) {}
  operation(lhs: L, rhs: R): A {
    return this.op(lhs, rhs);
  }
  apply(lhs: Result<L>, rhs: Result<R>): Result<A> {
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

const dollarIntMinus = (lhs: Dollar, rhs: number) =>
  lhs.sub(Dollar.fromNumber(rhs));
const intDollarMinus = (lhs: number, rhs: Dollar) =>
  Dollar.fromNumber(lhs).sub(rhs);
const rationalIntMinus = (lhs: Rational, rhs: number) =>
  lhs.sub(Rational.fromNumber(rhs));
const intRationalMinus = (lhs: number, rhs: Rational) =>
  Rational.fromNumber(lhs).sub(rhs);
const dollarRationalMinus = (lhs: Dollar, rhs: Rational) => {
  return lhs.sub(Dollar.fromNumber(rhs.n / rhs.d));
};
const rationalDollarMinus = (lhs: Rational, rhs: Dollar) => {
  return Dollar.fromNumber(lhs.n / lhs.d).sub(rhs);
};
const dayDaysMinus = (lhs: Day, rhs: Days) => lhs.sub(rhs);

const intIntBinaryOperator = new SubtractBinaryOperator(intMinus);
const dollarDollarBinaryOperator = new SubtractBinaryOperator(dollarMinus);
const rationalRationalBinaryOperator = new SubtractBinaryOperator(
  rationalMinus
);
const dollarIntBinaryOperator = new SubtractBinaryOperator(dollarIntMinus);
const intDollarBinaryOperator = new SubtractBinaryOperator(intDollarMinus);
const rationalIntBinaryOperator = new SubtractBinaryOperator(rationalIntMinus);
const intRationalBinaryOperator = new SubtractBinaryOperator(intRationalMinus);
const dollarRationalBinaryOperator = new SubtractBinaryOperator(
  dollarRationalMinus
);
const rationalDollarBinaryOperator = new SubtractBinaryOperator(
  rationalDollarMinus
);
const dayDaysBinaryOperator = new SubtractBinaryOperator(dayDaysMinus);

const binarySubtract = (lhs: CompNode, rhs: CompNode): CompNode => {
  if (lhs instanceof IntNode && rhs instanceof IntNode) {
    return new IntNode(
      new BinaryExpression(lhs.expr, rhs.expr, intIntBinaryOperator)
    );
  }
  if (lhs instanceof DollarNode && rhs instanceof DollarNode) {
    return new DollarNode(
      new BinaryExpression(
        lhs.expr,
        rhs.expr,
        dollarDollarBinaryOperator
      )
    );
  }
  if (lhs instanceof RationalNode && rhs instanceof RationalNode) {
    return new RationalNode(
      new BinaryExpression(
        lhs.expr,
        rhs.expr,
        rationalRationalBinaryOperator
      )
    );
  }
  if (lhs instanceof IntNode && rhs instanceof DollarNode) {
    return new DollarNode(
      new BinaryExpression(lhs.expr, rhs.expr, intDollarBinaryOperator)
    );
  }
  if (lhs instanceof DollarNode && rhs instanceof IntNode) {
    return new DollarNode(
      new BinaryExpression(
        lhs.expr,
        rhs.expr,
        dollarIntBinaryOperator
      )
    );
  }
  if (lhs instanceof IntNode && rhs instanceof RationalNode) {
    return new RationalNode(
      new BinaryExpression(
        lhs.expr,
        rhs.expr,
        intRationalBinaryOperator
      )
    );
  }
  if (lhs instanceof RationalNode && rhs instanceof IntNode) {
    return new RationalNode(
      new BinaryExpression(
        lhs.expr,
        rhs.expr,
        rationalIntBinaryOperator
      )
    );
  }
  if (lhs instanceof RationalNode && rhs instanceof DollarNode) {
    return new DollarNode(
      new BinaryExpression(
        lhs.expr,
        rhs.expr,
        rationalDollarBinaryOperator
      )
    );
  }
  if (lhs instanceof DollarNode && rhs instanceof RationalNode) {
    return new DollarNode(
      new BinaryExpression(
        lhs.expr,
        rhs.expr,
        dollarRationalBinaryOperator
      )
    );
  }
  if (lhs instanceof DayNode && rhs instanceof DaysNode) {
    return new DayNode(
      new BinaryExpression(lhs.expr, rhs.expr, dayDaysBinaryOperator)
    );
  }
  throw new Error(
    `cannot subtract a ${lhs.constructor.name} and a ${rhs.constructor.name}`
  );
}

export const SubtractFactory: CompNodeFactory = {
  typeName: 'Subtract',

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    const minuend = compNodeRegistry.fromDerivedConfig(
      e.children.find((c: any) => c.key === 'Minuend').children[0],
      graph
    );
    const subtrahends = e.children
      .find((c: any) => c.key === 'Subtrahends')
      .children.map((child: any) =>
        compNodeRegistry.fromDerivedConfig(child, graph)
      );
    return this.create([minuend, ...subtrahends]);
  },

  create(nodes: CompNode[]): CompNode {
    if (nodes.every((n) => n instanceof IntNode)) {
      const expressions = nodes.map((n) => (n as IntNode).expr);
      return new IntNode(new ReduceExpression(expressions, intReduceOperator));
    }
    if (nodes.every((n) => n instanceof DollarNode)) {
      const expressions = nodes.map((n) => (n as DollarNode).expr);
      return new DollarNode(
        new ReduceExpression(expressions, dollarReduceOperator)
      );
    }
    if (nodes.every((n) => n instanceof RationalNode)) {
      const expressions = nodes.map((n) => (n as RationalNode).expr);
      return new RationalNode(
        new ReduceExpression(expressions, rationalReduceOperator)
      );
    }
    return nodes.reduce(binarySubtract);
  },
};
