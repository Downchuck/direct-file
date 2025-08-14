import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { IntNode } from './IntNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { DayNode } from './DayNode';
import { BooleanNode } from './BooleanNode';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { Day } from '../types/Day';
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
import { Expression } from '../Expression';

class GreaterThanOrEqualBinaryOperator<L, R>
  implements BinaryOperator<boolean, L, R>
{
  constructor(private readonly op: (lhs: L, rhs: R) => boolean) {}
  operation(lhs: L, rhs: R): boolean {
    return this.op(lhs, rhs);
  }
  apply(lhs: Result<L>, rhs: Result<R>): Result<boolean> {
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

const intGte = (x: number, y: number) => x >= y;
const dollarGte = (x: Dollar, y: Dollar) => x.gte(y);
const rationalGte = (x: Rational, y: Rational) => x.gte(y);
const dayGte = (x: Day, y: Day) => x.toDate() >= y.toDate();

const intIntBinaryOperator = new GreaterThanOrEqualBinaryOperator(intGte);
const dollarDollarBinaryOperator = new GreaterThanOrEqualBinaryOperator(
  dollarGte
);
const rationalRationalBinaryOperator = new GreaterThanOrEqualBinaryOperator(
  rationalGte
);
const dayDayBinaryOperator = new GreaterThanOrEqualBinaryOperator(dayGte);

export class GreaterThanOrEqualFactory implements CompNodeFactory {
  readonly typeName = 'GreaterThanOrEqual';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const lhs = compNodeRegistry.fromDerivedConfig(
      e.children.find((c: any) => c.key === 'Left').children[0],
      factual,
      factDictionary
    );
    const rhs = compNodeRegistry.fromDerivedConfig(
      e.children.find((c: any) => c.key === 'Right').children[0],
      factual,
      factDictionary
    );
    return this.create(lhs, rhs);
  }

  create(lhs: CompNode, rhs: CompNode): CompNode {
    if (lhs instanceof IntNode && rhs instanceof IntNode) {
      return new BooleanNode(
        new BinaryExpression(lhs.expr, rhs.expr, intIntBinaryOperator)
      );
    }
    if (lhs instanceof DollarNode && rhs instanceof DollarNode) {
      return new BooleanNode(
        new BinaryExpression(lhs.expr, rhs.expr, dollarDollarBinaryOperator)
      );
    }
    if (lhs instanceof RationalNode && rhs instanceof RationalNode) {
      return new BooleanNode(
        new BinaryExpression(
          lhs.expr,
          rhs.expr,
          rationalRationalBinaryOperator
        )
      );
    }
    if (lhs instanceof DayNode && rhs instanceof DayNode) {
      return new BooleanNode(
        new BinaryExpression(lhs.expr, rhs.expr, dayDayBinaryOperator)
      );
    }
    throw new Error(
      `cannot compare a ${lhs.constructor.name} and a ${rhs.constructor.name}`
    );
  }
}

compNodeRegistry.register(new GreaterThanOrEqualFactory());
