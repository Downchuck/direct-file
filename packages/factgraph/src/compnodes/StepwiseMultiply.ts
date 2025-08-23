import { CompNode, DerivedNodeFactory } from './CompNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { BinaryOperator, applyBinary, explainBinary } from '../operators/BinaryOperator';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { Result } from '../types';
import { Graph } from '../Graph';
import { Factual } from '../Factual';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';

const stepwiseMultiplyOp = (dollar: Dollar, rational: Rational) => {
    const cents = dollar.toNumber() * 100;
    const resultCents = (cents / rational.d) * rational.n;
    return Dollar.from(resultCents / 100);
};

class StepwiseMultiplyOperator implements BinaryOperator<Dollar, Dollar, Rational> {
    operation = stepwiseMultiplyOp;
    apply = (lhs: Result<Dollar>, rhs: Result<Rational>) => applyBinary(this, lhs, rhs);
    explain = (lhs: Expression<Dollar>, rhs: Expression<Rational>, factual: Factual) => explainBinary(lhs, rhs, factual);
}

const stepwiseMultiplyOperator = new StepwiseMultiplyOperator();

export const StepwiseMultiplyFactory: DerivedNodeFactory = {
  typeName: 'StepwiseMultiply',
  fromDerivedConfig(e: any, graph: Graph, children: CompNode[]): CompNode {
    if (children.length !== 2) {
        throw new Error(`StepwiseMultiply expects 2 children, but got ${children.length}`);
    }
    const [multiplicand, rate] = children;

    if (!(multiplicand instanceof DollarNode)) {
      throw new Error('StepwiseMultiply `Multiplicand` must be a DollarNode');
    }
    if (!(rate instanceof RationalNode)) {
      throw new Error('StepwiseMultiply `Rate` must be a RationalNode');
    }

    return new DollarNode(new BinaryExpression(stepwiseMultiplyOperator));
  },
};
