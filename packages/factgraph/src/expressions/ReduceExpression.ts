import { Expression } from '../Expression';
import { ReduceOperator } from '../operators/ReduceOperator';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Explanation, ConstantExplanation } from '../Explanation';

export class ReduceExpression<A> extends Expression<A> {
  constructor(
    public readonly expressions: Expression<A>[],
    public readonly op: ReduceOperator<A>
  ) {
    super();
    this.get = this.get.bind(this);
    this.explain = this.explain.bind(this);
  }

  override get(factual: Factual): Result<A> {
    if (this.expressions.length === 0) {
      return Result.incomplete();
    }
    const head = this.expressions[0];
    const tail = this.expressions.slice(1);
    return this.op.apply(
      head.get(factual),
      tail.map((e) => e.getThunk(factual))
    );
  }

  override explain(factual: Factual): Explanation {
    if (!this.op) {
      return new ConstantExplanation();
    }
    return this.op.explain(this.expressions, factual);
  }
}
