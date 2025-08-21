import { CompNode, CompNodeFactory } from './CompNode';
import { IntNode } from './IntNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { DayNode } from './DayNode';
import { DaysNode } from './DaysNode';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import {
  BinaryOperator,
} from '../operators/BinaryOperator';
import {
  applyBinary,
  explainBinary,
} from '../operators/BinaryOperatorHelpers';
import {
  ReduceOperator,
} from '../operators/ReduceOperator';
import {
  applyReduce,
  explainReduce,
} from '../operators/ReduceOperatorHelpers';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { ReduceExpression } from '../expressions/ReduceExpression';
import { Result } from '../types/Result';
import { Thunk } from '../Thunk';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';
import { compNodeRegistry } from './registry';

function createAddReduceOperator<A>(plus: (x: A, y: A) => A): ReduceOperator<A> {
  return {
    reduce(x: A, y: A): A {
      return plus(x, y);
    },
    apply(head: Result<A>, tail: Thunk<Result<A>>[]): Result<A> {
      return applyReduce(this, head, tail);
    },
    explain(xs: Expression<A>[], factual: Factual): Explanation {
      return explainReduce(xs, factual);
    },
  };
}

const intPlus = (x: number, y: number) => x + y;
const dollarPlus = (x: Dollar, y: Dollar) => x.add(y);
const rationalPlus = (x: Rational, y: Rational) => x.add(y);
const dayPlus = (x: any, y: any) => x.add(y);

const intReduceOperator = createAddReduceOperator(intPlus);
const dollarReduceOperator = createAddReduceOperator(dollarPlus);
const rationalReduceOperator = createAddReduceOperator(rationalPlus);
const dayReduceOperator = createAddReduceOperator(dayPlus);

function createAddBinaryOperator<A, L, R>(op: (lhs: L, rhs: R) => A): BinaryOperator<A, L, R> {
  return {
    operation(lhs: L, rhs: R): A {
      return op(lhs, rhs);
    },
    apply(lhs: Result<L>, rhs: Result<R>): Result<A> {
      return applyBinary(this, lhs, rhs);
    },
    explain(
      lhs: Expression<L>,
      rhs: Expression<R>,
      factual: Factual
    ): Explanation {
      return explainBinary(lhs, rhs, factual);
    },
  };
}

const dollarIntPlus = (lhs: Dollar, rhs: number) =>
  lhs.add(Dollar.fromNumber(rhs));
const intDollarPlus = (lhs: number, rhs: Dollar) =>
  Dollar.fromNumber(lhs).add(rhs);
const rationalIntPlus = (lhs: Rational, rhs: number) =>
  lhs.add(Rational.fromNumber(rhs));
const intRationalPlus = (lhs: number, rhs: Rational) =>
  Rational.fromNumber(lhs).add(rhs);
const dollarRationalPlus = (lhs: Dollar, rhs: Rational) => {
  return lhs.add(Dollar.fromNumber(rhs.n / rhs.d));
};
const rationalDollarPlus = (lhs: Rational, rhs: Dollar) => {
  return Dollar.fromNumber(lhs.n / lhs.d).add(rhs);
};

const intIntBinaryOperator = createAddBinaryOperator(intPlus);
const dollarDollarBinaryOperator = createAddBinaryOperator(dollarPlus);
const rationalRationalBinaryOperator = createAddBinaryOperator(rationalPlus);
const dayDayBinaryOperator = createAddBinaryOperator(dayPlus);
const dollarIntBinaryOperator = createAddBinaryOperator(dollarIntPlus);
const intDollarBinaryOperator = createAddBinaryOperator(intDollarPlus);
const rationalIntBinaryOperator = createAddBinaryOperator(rationalIntPlus);
const intRationalBinaryOperator = createAddBinaryOperator(intRationalPlus);
const dollarRationalBinaryOperator = createAddBinaryOperator(dollarRationalPlus);
const rationalDollarBinaryOperator = createAddBinaryOperator(rationalDollarPlus);

function binaryAdd(lhs: CompNode, rhs: CompNode): CompNode {
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
  if (lhs instanceof DayNode && rhs instanceof DaysNode) {
    return new DayNode(
      new BinaryExpression(lhs.expr, rhs.expr, dayDayBinaryOperator)
    );
  }
  if (lhs instanceof DaysNode && rhs instanceof DayNode) {
    return new DayNode(
      new BinaryExpression(lhs.expr, rhs.expr, dayDayBinaryOperator)
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
    `cannot add a ${lhs.constructor.name} and a ${rhs.constructor.name}`
  );
}

export const AddFactory: CompNodeFactory = {
  typeName: 'Add',

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    throw new Error('fromDerivedConfig not implemented for Add');
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
    if (
      nodes.every((n) => n instanceof DayNode || n instanceof DaysNode)
    ) {
      const expressions = nodes.map((n) => n.expr);
      return new DayNode(new ReduceExpression(expressions, dayReduceOperator));
    }
    let acc = nodes[0];
    for (let i = 1; i < nodes.length; i++) {
      acc = binaryAdd(acc, nodes[i]);
    }
    return acc;
  },
};
