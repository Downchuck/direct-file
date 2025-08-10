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

class AddReduceOperator<A> implements ReduceOperator<A> {
  constructor(private readonly plus: (x: A, y: A) => A) {}
  reduce(x: A, y: A): A {
    return this.plus(x, y);
  }
}

const intPlus = (x: number, y: number) => x + y;
const dollarPlus = (x: Dollar, y: Dollar) => x.add(y);
const rationalPlus = (x: Rational, y: Rational) => x.add(y);

const intReduceOperator = new AddReduceOperator(intPlus);
const dollarReduceOperator = new AddReduceOperator(dollarPlus);
const rationalReduceOperator = new AddReduceOperator(rationalPlus);

class AddBinaryOperator<A, L, R> implements BinaryOperator<A, L, R> {
  constructor(private readonly op: (lhs: L, rhs: R) => A) {}
  operation(lhs: L, rhs: R): A {
    return this.op(lhs, rhs);
  }
}

const dollarIntPlus = (lhs: Dollar, rhs: number) => lhs.add(Dollar.fromNumber(rhs));
const intDollarPlus = (lhs: number, rhs: Dollar) => Dollar.fromNumber(lhs).add(rhs);
const rationalIntPlus = (lhs: Rational, rhs: number) =>
  lhs.add(Rational.fromNumber(rhs));
const intRationalPlus = (lhs: number, rhs: Rational) =>
  Rational.fromNumber(lhs).add(rhs);
const dollarRationalPlus = (lhs: Dollar, rhs: Rational) => {
  // This is a bit of a hack. We should probably use a proper decimal to rational conversion.
  return lhs.add(Dollar.fromNumber(rhs.n / rhs.d));
};
const rationalDollarPlus = (lhs: Rational, rhs: Dollar) => {
  // This is a bit of a hack. We should probably use a proper decimal to rational conversion.
  return Dollar.fromNumber(lhs.n / lhs.d).add(rhs);
};

const intIntBinaryOperator = new AddBinaryOperator(intPlus);
const dollarDollarBinaryOperator = new AddBinaryOperator(dollarPlus);
const rationalRationalBinaryOperator = new AddBinaryOperator(rationalPlus);
const dollarIntBinaryOperator = new AddBinaryOperator(dollarIntPlus);
const intDollarBinaryOperator = new AddBinaryOperator(intDollarPlus);
const rationalIntBinaryOperator = new AddBinaryOperator(rationalIntPlus);
const intRationalBinaryOperator = new AddBinaryOperator(intRationalPlus);
const dollarRationalBinaryOperator = new AddBinaryOperator(dollarRationalPlus);
const rationalDollarBinaryOperator = new AddBinaryOperator(rationalDollarPlus);

class AddFactory implements CompNodeFactory {
  readonly typeName = 'Add';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const addends = e.children.map((child: any) =>
      compNodeRegistry.fromDerivedConfig(child, factual, factDictionary)
    );
    return this.create(addends);
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
    return nodes.reduce((lhs, rhs) => this.binaryAdd(lhs, rhs));
  }

  private binaryAdd(lhs: CompNode, rhs: CompNode): CompNode {
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
      `cannot add a ${lhs.constructor.name} and a ${rhs.constructor.name}`
    );
  }
}

compNodeRegistry.register(new AddFactory());
