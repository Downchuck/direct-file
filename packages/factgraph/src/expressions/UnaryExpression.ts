import { Expression } from '../Expression';
import { UnaryOperator } from '../operators/UnaryOperator';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Explanation } from '../Explanation';

export class UnaryExpression<A, B> extends Expression<B> {
  constructor(public readonly op: UnaryOperator<A, B>) {
    super();
  }

  override get(factual: Factual, ...children: Expression<any>[]): Result<B> {
    if (children.length !== 1) {
      throw new Error(`UnaryExpression expects 1 child, but got ${children.length}`);
    }
    const child = children[0] as Expression<A>;
    const childResult = child.get(factual);
    return this.op.apply(childResult);
  }

  override explain(factual: Factual, ...children: Expression<any>[]): Explanation {
    if (children.length !== 1) {
        throw new Error(`UnaryExpression expects 1 child, but got ${children.length}`);
    }
    const child = children[0] as Expression<A>;
    return this.op.explain(child, factual);
  }
}
