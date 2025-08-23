import { Expression } from '../Expression';
import { AggregateOperator } from '../operators/AggregateOperator';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Explanation } from '../Explanation';

export class AggregateExpression<A, B> extends Expression<B> {
  constructor(public readonly op: AggregateOperator<A, B>) {
    super();
  }

  override get(factual: Factual, ...children: Expression<any>[]): Result<B> {
    if (children.length !== 1) {
        throw new Error(`AggregateExpression expects 1 child, but got ${children.length}`);
    }
    const child = children[0] as Expression<A>;
    const vector = child.getVector(factual);
    return this.op.apply(vector);
  }

  override explain(factual: Factual, ...children: Expression<any>[]): Explanation {
    if (children.length !== 1) {
        throw new Error(`AggregateExpression expects 1 child, but got ${children.length}`);
    }
    const child = children[0] as Expression<A>;
    return this.op.explain(child, factual);
  }
}
