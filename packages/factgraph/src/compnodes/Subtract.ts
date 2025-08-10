import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { IntNode } from './IntNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { DayNode } from './DayNode';
import { DaysNode } from './DaysNode';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { Day } from '../types/Day';
import { Days } from '../types/Days';
import { Expression } from '../Expression';
import { BinaryOperator } from '../operators/BinaryOperator';
import { ReduceOperator } from '../operators/ReduceOperator';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';

class SubtractReduceOperator<A> implements ReduceOperator<A> {
  constructor(private readonly minus: (x: A, y: A) => A) {}
  reduce(x: A, y: A): A {
    return this.minus(x, y);
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
}

const dayDaysMinus = (lhs: Day, rhs: Days) => lhs.sub(rhs);
const dollarIntMinus = (lhs: Dollar, rhs: number) => lhs.sub(Dollar.fromNumber(rhs));
const intDollarMinus = (lhs: number, rhs: Dollar) => Dollar.fromNumber(lhs).sub(rhs);
const rationalIntMinus = (lhs: Rational, rhs: number) =>
  lhs.sub(Rational.fromNumber(rhs));
const intRationalMinus = (lhs: number, rhs: Rational) =>
  Rational.fromNumber(lhs).sub(rhs);
const dollarRationalMinus = (lhs: Dollar, rhs: Rational) => {
  // This is a bit of a hack. We should probably use a proper decimal to rational conversion.
  return lhs.sub(Dollar.fromNumber(rhs.n / rhs.d));
};
const rationalDollarMinus = (lhs: Rational, rhs: Dollar) => {
  // This is a bit of a hack. We should probably use a proper decimal to rational conversion.
  return Dollar.fromNumber(lhs.n / lhs.d).sub(rhs);
};

const intIntBinaryOperator = new SubtractBinaryOperator(intMinus);
const dollarDollarBinaryOperator = new SubtractBinaryOperator(dollarMinus);
const rationalRationalBinaryOperator = new SubtractBinaryOperator(
  rationalMinus
);
const dayDaysBinaryOperator = new SubtractBinaryOperator(dayDaysMinus);
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

class SubtractFactory implements CompNodeFactory {
  readonly typeName = 'Subtract';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const minuend = compNodeRegistry.fromDerivedConfig(
      e.children.find((c: any) => c.typeName === 'Minuend').children[0],
      factual,
      factDictionary
    );
    const subtrahends = e.children
      .find((c: any) => c.typeName === 'Subtrahends')
      .children.map((child: any) =>
        compNodeRegistry.fromDerivedConfig(child, factual, factDictionary)
      );

    return this.create([minuend, ...subtrahends]);
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
    return nodes.reduce((lhs, rhs) => this.binarySubtract(lhs, rhs));
  }

  private binarySubtract(lhs: CompNode, rhs: CompNode): CompNode {
    if (lhs instanceof IntNode && rhs instanceof IntNode) {
      return new IntNode(new Expression()); // TODO: new BinaryExpression
    }
    if (lhs instanceof DollarNode && rhs instanceof DollarNode) {
      return new DollarNode(new Expression()); // TODO: new BinaryExpression
    }
    if (lhs instanceof RationalNode && rhs instanceof RationalNode) {
      return new RationalNode(new Expression()); // TODO: new BinaryExpression
    }
    if (lhs instanceof DayNode && rhs instanceof DaysNode) {
      return new DayNode(new Expression()); // TODO: new BinaryExpression
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
      `cannot subtract a ${rhs.constructor.name} from a ${lhs.constructor.name}`
    );
  }
}

compNodeRegistry.register(new SubtractFactory());
