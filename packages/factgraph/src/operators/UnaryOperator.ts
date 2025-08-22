import { Result } from '../types/Result';
import { Explanation, opWithInclusiveChildren } from '../Explanation';
import { Expression } from '../Expression';
import { Factual } from '../Factual';

export class UnaryOperator<A, B> {
  constructor(public readonly op: (a: A) => B) {}

  public apply(a: Result<A>): Result<B> {
    if (a.isComplete) {
      return Result.complete(this.op(a.get));
    }
    if (a.isPlaceholder) {
      return Result.placeholder(this.op(a.get));
    }
    return Result.incomplete();
  }

  public explain(expression: Expression<A>, factual: Factual): Explanation {
    return opWithInclusiveChildren([expression.explain(factual)]);
  }
}
