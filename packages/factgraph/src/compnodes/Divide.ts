import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { IntNode } from './IntNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { Expression } from '../Expression';
import { BinaryOperator } from '../operators/BinaryOperator';
import { ReduceOperator } from '../operators/ReduceOperator';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';

class DivideReduceOperator<A> implements ReduceOperator<A> {
  constructor(private readonly div: (x: A, y: A) => A) {}
  reduce(x: A, y: A): A {
    return this.div(x, y);
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
}

const intIntDiv = (lhs: number, rhs: number) => new Rational(lhs, rhs);
const intDollarDiv = (lhs: number, rhs: Dollar) => Dollar.fromNumber(lhs).div(rhs);
const dollarIntDiv = (lhs: Dollar, rhs: number) => lhs.div(Dollar.fromNumber(rhs));
const intRationalDiv = (lhs: number, rhs: Rational) =>
  Rational.fromNumber(lhs).div(rhs);
const rationalIntDiv = (lhs: Rational, rhs: number) =>
  lhs.div(Rational.fromNumber(rhs));
const dollarRationalDiv = (lhs: Dollar, rhs: Rational) => {
  return lhs.mul(new Dollar(new Rational(rhs.d, rhs.n)));
};
const rationalDollarDiv = (lhs: Rational, rhs: Dollar) => {
  return new Dollar(lhs).div(rhs);
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

class DivideFactory implements CompNodeFactory {
  readonly typeName = 'Divide';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const dividend = compNodeRegistry.fromDerivedConfig(
      e.children.find((c: any) => c.typeName === 'Dividend').children[0],
      factual,
      factDictionary
    );
    const divisors = e.children
      .find((c: any) => c.typeName === 'Divisors')
      .children.map((child: any) =>
        compNodeRegistry.fromDerivedConfig(child, factual, factDictionary)
      );

    return this.create([dividend, ...divisors]);
  }

  create(nodes: CompNode[]): CompNode {
    if (
      nodes.every((n) => n instanceof DollarNode)
    ) {
      return new DollarNode(
        new Expression() // TODO: new ReduceExpression
      );
    }
    if (
      nodes.every((n) => n instanceof RationalNode)
    ) {
      return new RationalNode(
        new Expression() // TODO: new ReduceExpression
      );
    }
    return nodes.reduce((lhs, rhs) => this.binaryDivide(lhs, rhs));
  }

  private binaryDivide(lhs: CompNode, rhs: CompNode): CompNode {
    if (lhs instanceof IntNode && rhs instanceof IntNode) {
      return new RationalNode(new Expression()); // TODO: new BinaryExpression
    }
    if (lhs instanceof DollarNode && rhs instanceof DollarNode) {
      return new DollarNode(new Expression()); // TODO: new BinaryExpression
    }
    if (lhs instanceof RationalNode && rhs instanceof RationalNode) {
      return new RationalNode(new Expression()); // TODO: new BinaryExpression
    }
    if (lhs instanceof IntNode && rhs instanceof DollarNode) {
      return new DollarNode(new Expression()); // TODO: new BinaryExpression
    }
    if (lhs instanceof DollarNode && rhs instanceof IntNode) {
      return new DollarNode(new Expression()); // TODO: new BinaryExpression
    }
    if (lhs instanceof IntNode && rhs instanceof RationalNode) {
      return new RationalNode(new Expression()); // TODO: new BinaryExpression
    }
    if (lhs instanceof RationalNode && rhs instanceof IntNode) {
      return new RationalNode(new Expression()); // TODO: new BinaryExpression
    }
    if (lhs instanceof RationalNode && rhs instanceof DollarNode) {
      return new DollarNode(new Expression()); // TODO: new BinaryExpression
    }
    if (lhs instanceof DollarNode && rhs instanceof RationalNode) {
      return new DollarNode(new Expression()); // TODO: new BinaryExpression
    }
    throw new Error(
      `cannot divide a ${lhs.constructor.name} by a ${rhs.constructor.name}`
    );
  }
}

compNodeRegistry.register(new DivideFactory());
