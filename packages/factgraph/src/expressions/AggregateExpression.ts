import { Expression } from '../Expression';
import { AggregateOperator } from '../operators/AggregateOperator';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Explanation, ConstantExplanation } from '../Explanation';

export class AggregateExpression<A, B> extends Expression<B> {
  constructor(
    public readonly expression: Expression<A>,
    public readonly op: AggregateOperator<A, B>
  ) {
    super();
  }

  override get(factual: Factual): Result<B> {
    return this.op.apply((this.expression as any).getVector(factual));
  }

  override explain(factual: Factual): Explanation {
    if (!this.op) {
      return new ConstantExplanation();
    }
    return this.op.explain(this.expression, factual);
  }
}
