import { CompNode, CompNodeFactory } from './CompNode';
import { IntNode } from './IntNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { Expression } from '../Expression';
import {
  BinaryOperator,
  applyBinary,
  explainBinary,
} from '../operators/BinaryOperator';
import {
  ReduceOperator,
  applyReduce,
  explainReduce,
} from '../operators/ReduceOperator';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { ReduceExpression } from '../expressions/ReduceExpression';
import { Result } from '../types';
import { Thunk } from '../Thunk';
import { Explanation } from '../Explanation';
import { compNodeRegistry } from './registry';

class DivideReduceOperator<A> implements ReduceOperator<A> {
  constructor(private readonly div: (x: A, y: A) => A) {}
  reduce(x: A, y: A): A {
    return this.div(x, y);
  }
  apply(head: Result<A>, tail: Thunk<Result<A>>[]): Result<A> {
    return applyReduce(this, head, tail);
  }
  explain(xs: Expression<A>[], factual: Factual): Explanation {
    return explainReduce(xs, factual);
  }
}

const dollarDiv = (x: Dollar, y: Dollar) => x.div(y);
const rationalDiv = (x: Rational, y: Rational) => x.div(y);

const dollarReduceOperator = new DivideReduceOperator(dollarDiv);
const rationalReduceOperator = new DivideReduceOperator(rationalDiv);

class DivideBinaryOperator<A, L, R> implements BinaryOperator<A, L, R> {
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

const intIntDiv = (lhs: number, rhs: number) => new Rational(lhs, rhs);
const intDollarDiv = (lhs: number, rhs: Dollar) =>
  Dollar.fromNumber(lhs).div(rhs);
const dollarIntDiv = (lhs: Dollar, rhs: number) =>
  lhs.div(Dollar.fromNumber(rhs));
const intRationalDiv = (lhs: number, rhs: Rational) =>
  Rational.fromNumber(lhs).div(rhs);
const rationalIntDiv = (lhs: Rational, rhs: number) =>
  lhs.div(Rational.fromNumber(rhs));
const dollarRationalDiv = (lhs: Dollar, rhs: Rational) => {
  return lhs.mul(Dollar.fromNumber(new Rational(rhs.d, rhs.n).n));
};
const rationalDollarDiv = (lhs: Rational, rhs: Dollar) => {
  return Dollar.fromNumber(lhs.n / lhs.d).div(rhs);
};

const intIntBinaryOperator = new DivideBinaryOperator(intIntDiv);
const dollarDollarBinaryOperator = new DivideBinaryOperator(dollarDiv);
const rationalRationalBinaryOperator = new DivideBinaryOperator(rationalDiv);
const intDollarBinaryOperator = new DivideBinaryOperator(intDollarDiv);
const dollarIntBinaryOperator = new DivideBinaryOperator(dollarIntDiv);
const intRationalBinaryOperator = new DivideBinaryOperator(intRationalDiv);
const rationalIntBinaryOperator = new DivideBinaryOperator(rationalIntDiv);
const dollarRationalBinaryOperator = new DivideBinaryOperator(
  dollarRationalDiv
);
const rationalDollarBinaryOperator = new DivideBinaryOperator(
  rationalDollarDiv
);

export class DivideFactory implements CompNodeFactory {
  readonly typeName = 'Divide';

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    const dividend = compNodeRegistry.fromDerivedConfig(
      e.children.find((c: any) => c.typeName === 'Dividend').children[0],
      graph
    );
    const divisors = e.children
      .find((c: any) => c.typeName === 'Divisors')
      .children.map((child: any) =>
        compNodeRegistry.fromDerivedConfig(child, graph)
      );

    return this.create([dividend, ...divisors]);
  }

  create(nodes: CompNode[]): CompNode {
    if (nodes.every((n) => n instanceof DollarNode)) {
      return new DollarNode(
        new ReduceExpression(
          nodes.map((n) => (n as DollarNode).expr),
          dollarReduceOperator
        )
      );
    }
    if (nodes.every((n) => n instanceof RationalNode)) {
      return new RationalNode(
        new ReduceExpression(
          nodes.map((n) => (n as RationalNode).expr),
          rationalReduceOperator
        )
      );
    }
    return nodes.reduce((lhs, rhs) => this.binaryDivide(lhs, rhs));
  }

  private binaryDivide(lhs: CompNode, rhs: CompNode): CompNode {
    if (lhs instanceof IntNode && rhs instanceof IntNode) {
      return new RationalNode(
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
    throw new Error(
      `cannot divide a ${lhs.constructor.name} by a ${rhs.constructor.name}`
    );
  }
}
