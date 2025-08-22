import { Expression } from '../Expression';
import { BinaryOperator } from '../operators/BinaryOperator';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Explanation } from '../Explanation';

export class BinaryExpression<A, L, R> extends Expression<A> {
  constructor(
    public readonly op: BinaryOperator<A, L, R>
  ) {
    super();
  }

  override get(factual: Factual, ...children: Expression<any>[]): Result<A> {
    if (children.length !== 2) {
        throw new Error(`BinaryExpression expects 2 children, but got ${children.length}`);
    }
    const lhs = children[0] as Expression<L>;
    const rhs = children[1] as Expression<R>;

    const lhsResult = lhs.get(factual);
    const rhsResult = rhs.get(factual);

    return this.op.apply(lhsResult, rhsResult);
  }

  override explain(factual: Factual, ...children: Expression<any>[]): Explanation {
    if (children.length !== 2) {
        throw new Error(`BinaryExpression expects 2 children, but got ${children.length}`);
    }
    const lhs = children[0] as Expression<L>;
    const rhs = children[1] as Expression<R>;
    return this.op.explain(lhs, rhs, factual);
  }
}
