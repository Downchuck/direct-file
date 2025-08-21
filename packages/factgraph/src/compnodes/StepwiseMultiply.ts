import { CompNode, CompNodeFactory } from './CompNode';
import { IntNode } from './IntNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
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

function createStepwiseMultiplyReduceOperator<A>(
  plus: (x: A, y: A) => A
): ReduceOperator<A> {
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

const intMul = (x: number, y: number) => x * y;
const dollarMul = (x: Dollar, y: Dollar) => x.mul(y);
const rationalMul = (x: Rational, y: Rational) => x.mul(y);

const intReduceOperator = createStepwiseMultiplyReduceOperator(intMul);
const dollarReduceOperator = createStepwiseMultiplyReduceOperator(dollarMul);
const rationalReduceOperator = createStepwiseMultiplyReduceOperator(rationalMul);

function createStepwiseMultiplyBinaryOperator<A, L, R>(
  op: (lhs: L, rhs: R) => A
): BinaryOperator<A, L, R> {
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

const dollarIntMul = (lhs: Dollar, rhs: number) =>
  lhs.mul(Dollar.fromNumber(rhs));
const intDollarMul = (lhs: number, rhs: Dollar) =>
  Dollar.fromNumber(lhs).mul(rhs);
const rationalIntMul = (lhs: Rational, rhs: number) =>
  lhs.mul(Rational.fromNumber(rhs));
const intRationalMul = (lhs: number, rhs: Rational) =>
  Rational.fromNumber(lhs).mul(rhs);
const dollarRationalMul = (lhs: Dollar, rhs: Rational) => {
  return lhs.mul(Dollar.fromNumber(rhs.n / rhs.d));
};
const rationalDollarMul = (lhs: Rational, rhs: Dollar) => {
  return Dollar.fromNumber(lhs.n / lhs.d).mul(rhs);
};

const intIntBinaryOperator = createStepwiseMultiplyBinaryOperator(intMul);
const dollarDollarBinaryOperator = createStepwiseMultiplyBinaryOperator(dollarMul);
const rationalRationalBinaryOperator = createStepwiseMultiplyBinaryOperator(rationalMul);
const dollarIntBinaryOperator = createStepwiseMultiplyBinaryOperator(dollarIntMul);
const intDollarBinaryOperator = createStepwiseMultiplyBinaryOperator(intDollarMul);
const rationalIntBinaryOperator = createStepwiseMultiplyBinaryOperator(rationalIntMul);
const intRationalBinaryOperator = createStepwiseMultiplyBinaryOperator(intRationalMul);
const dollarRationalBinaryOperator = createStepwiseMultiplyBinaryOperator(
  dollarRationalMul
);
const rationalDollarBinaryOperator = createStepwiseMultiplyBinaryOperator(
  rationalDollarMul
);

function binaryMultiply(lhs: CompNode, rhs: CompNode): CompNode {
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
  throw new Error(
    `cannot multiply a ${lhs.constructor.name} and a ${rhs.constructor.name}`
  );
}

export const StepwiseMultiplyFactory: CompNodeFactory = {
  typeName: 'StepwiseMultiply',

  fromDerivedConfig(
    e: any,
    graph: any,
  ): CompNode {
    throw new Error('fromDerivedConfig not implemented for StepwiseMultiply');
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
    let acc = nodes[0];
    for (let i = 1; i < nodes.length; i++) {
      acc = binaryMultiply(acc, nodes[i]);
    }
    return acc;
  },
};
