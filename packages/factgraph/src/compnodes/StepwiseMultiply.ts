import { CompNode, DerivedNodeFactory } from './CompNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { BinaryOperator } from '../operators';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { applyBinary } from '../operators/BinaryOperatorHelpers';
import { Result } from '../types';
import { getChildNode } from '../util/getChildNode';
import { Graph } from '../Graph';

const StepwiseMultiplyOperator: BinaryOperator<Dollar, Dollar, Rational> = {
  name: 'StepwiseMultiply',
  isCommutative: false,
  operation: (dollar: Dollar, rational: Rational) => {
    const cents = dollar.toNumber() * 100;
    const resultCents = (cents / rational.denominator) * rational.numerator;
    return Dollar.fromNumber(resultCents / 100);
  },
  apply: (lhs: Result<Dollar>, rhs: Result<Rational>) =>
    applyBinary({ operation: StepwiseMultiplyOperator.operation }, lhs, rhs),
  explain: (l, r, f) => new (f.Explanation)(),
};

export const StepwiseMultiplyFactory: DerivedNodeFactory = {
  typeName: 'StepwiseMultiply',
  fromDerivedConfig(e: any, graph: Graph): CompNode {
    const multiplicand = getChildNode(e.Multiplicand, graph);
    const rate = getChildNode(e.Rate, graph);

    if (!(multiplicand instanceof DollarNode)) {
      throw new Error('StepwiseMultiply `Multiplicand` must be a DollarNode');
    }
    if (!(rate instanceof RationalNode)) {
      throw new Error('StepwiseMultiply `Rate` must be a RationalNode');
    }

    return new DollarNode(
      new BinaryExpression(multiplicand.expr, rate.expr, StepwiseMultiplyOperator)
    );
  },
};
