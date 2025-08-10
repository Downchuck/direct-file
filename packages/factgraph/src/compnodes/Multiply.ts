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

class MultiplyReduceOperator<A> implements ReduceOperator<A> {
  constructor(private readonly times: (x: A, y: A) => A) {}
  reduce(x: A, y: A): A {
    return this.times(x, y);
  }
}

const intTimes = (x: number, y: number) => x * y;
const dollarTimes = (x: Dollar, y: Dollar) => x.mul(y);
const rationalTimes = (x: Rational, y: Rational) => x.mul(y);

const intReduceOperator = new MultiplyReduceOperator(intTimes);
const dollarReduceOperator = new MultiplyReduceOperator(dollarTimes);
const rationalReduceOperator = new MultiplyReduceOperator(rationalTimes);

class MultiplyBinaryOperator<A, L, R> implements BinaryOperator<A, L, R> {
  constructor(private readonly op: (lhs: L, rhs: R) => A) {}
  operation(lhs: L, rhs: R): A {
    return this.op(lhs, rhs);
  }
}

const dollarIntTimes = (lhs: Dollar, rhs: number) => lhs.mul(Dollar.fromNumber(rhs));
const intDollarTimes = (lhs: number, rhs: Dollar) => Dollar.fromNumber(lhs).mul(rhs);
const rationalIntTimes = (lhs: Rational, rhs: number) =>
  lhs.mul(Rational.fromNumber(rhs));
const intRationalTimes = (lhs: number, rhs: Rational) =>
  Rational.fromNumber(lhs).mul(rhs);
const dollarRationalTimes = (lhs: Dollar, rhs: Rational) => {
  return lhs.mul(Dollar.fromNumber(rhs.n).div(Dollar.fromNumber(rhs.d)));
};
const rationalDollarTimes = (lhs: Rational, rhs: Dollar) => {
  return Dollar.fromNumber(lhs.n).div(Dollar.fromNumber(lhs.d)).mul(rhs);
};

const intIntBinaryOperator = new MultiplyBinaryOperator(intTimes);
const dollarDollarBinaryOperator = new MultiplyBinaryOperator(dollarTimes);
const rationalRationalBinaryOperator = new MultiplyBinaryOperator(
  rationalTimes
);
const dollarIntBinaryOperator = new MultiplyBinaryOperator(dollarIntTimes);
const intDollarBinaryOperator = new MultiplyBinaryOperator(intDollarTimes);
const rationalIntBinaryOperator = new MultiplyBinaryOperator(rationalIntTimes);
const intRationalBinaryOperator = new MultiplyBinaryOperator(intRationalTimes);
const dollarRationalBinaryOperator = new MultiplyBinaryOperator(
  dollarRationalTimes
);
const rationalDollarBinaryOperator = new MultiplyBinaryOperator(
  rationalDollarTimes
);

class MultiplyFactory implements CompNodeFactory {
  readonly typeName = 'Multiply';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const factors = e.children.map((child: any) =>
      compNodeRegistry.fromDerivedConfig(child, factual, factDictionary)
    );
    return this.create(factors);
  }

  create(nodes: CompNode[]): CompNode {
    if (nodes.every((n) => n instanceof IntNode)) {
      return new IntNode(
        new Expression() // TODO: new ReduceExpression
      );
    }
    if (nodes.every((n) => n instanceof DollarNode)) {
      return new DollarNode(
        new Expression() // TODO: new ReduceExpression
      );
    }
    if (nodes.every((n) => n instanceof RationalNode)) {
      return new RationalNode(
        new Expression() // TODO: new ReduceExpression
      );
    }
    return nodes.reduce((lhs, rhs) => this.binaryMultiply(lhs, rhs));
  }

  private binaryMultiply(lhs: CompNode, rhs: CompNode): CompNode {
    if (lhs instanceof IntNode && rhs instanceof IntNode) {
      return new IntNode(new Expression()); // TODO: new BinaryExpression
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
      `cannot multiply a ${lhs.constructor.name} and a ${rhs.constructor.name}`
    );
  }
}

compNodeRegistry.register(new MultiplyFactory());
