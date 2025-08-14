import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
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
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { Result } from '../types';
import { Explanation } from '../Explanation';

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

const intSub = (x: number, y: number) => x - y;
const dollarSub = (x: Dollar, y: Dollar) => x.sub(y);
const rationalSub = (x: Rational, y: Rational) => x.sub(y);

const intIntBinaryOperator = new SubtractBinaryOperator(intSub);
const dollarDollarBinaryOperator = new SubtractBinaryOperator(dollarSub);
const rationalRationalBinaryOperator = new SubtractBinaryOperator(rationalSub);
const intDollarBinaryOperator = new SubtractBinaryOperator(
  (lhs: number, rhs: Dollar) => Dollar.fromNumber(lhs).sub(rhs)
);
const dollarIntBinaryOperator = new SubtractBinaryOperator(
  (lhs: Dollar, rhs: number) => lhs.sub(Dollar.fromNumber(rhs))
);
const intRationalBinaryOperator = new SubtractBinaryOperator(
  (lhs: number, rhs: Rational) => Rational.fromNumber(lhs).sub(rhs)
);
const rationalIntBinaryOperator = new SubtractBinaryOperator(
  (lhs: Rational, rhs: number) => lhs.sub(Rational.fromNumber(rhs))
);
const dollarRationalBinaryOperator = new SubtractBinaryOperator(
  (lhs: Dollar, rhs: Rational) => lhs.sub(Dollar.fromNumber(rhs.n / rhs.d))
);
const rationalDollarBinaryOperator = new SubtractBinaryOperator(
  (lhs: Rational, rhs: Dollar) => Dollar.fromNumber(lhs.n / lhs.d).sub(rhs)
);

class SubtractFactory implements CompNodeFactory {
  readonly typeName = 'Subtract';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const minuend = compNodeRegistry.fromDerivedConfig(
      e.children.find((c: any) => c.key === 'Minuend').children[0],
      factual,
      factDictionary
    );
    const subtrahend = compNodeRegistry.fromDerivedConfig(
      e.children.find((c: any) => c.key === 'Subtrahend').children[0],
      factual,
      factDictionary
    );

    return this.create(minuend, subtrahend);
  }

  create(lhs: CompNode, rhs: CompNode): CompNode {
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
      `cannot subtract a ${rhs.constructor.name} from a ${lhs.constructor.name}`
    );
  }
}

compNodeRegistry.register(new SubtractFactory());
