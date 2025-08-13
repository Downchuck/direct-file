import { Explanation, opWithExclusiveChildren } from '../Explanation';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { UnaryOperator } from '../operators/UnaryOperator';
import { Result } from '../types/Result';
import { Thunk } from '../Thunk';

export class UnaryExpression<T, V> extends Expression<V> {
  constructor(
    private readonly a: Expression<T>,
    private readonly operator: UnaryOperator<T, V>
  ) {
    super();
  }

  get(factual: Factual): Result<V> {
    return this.operator.apply(this.a.get(factual));
  }

  getThunk(factual: Factual): Thunk<Result<V>> {
    return new Thunk(() => this.get(factual));
  }

  explain(factual: Factual): Explanation {
    return this.operator.explain(this.a, factual);
  }
}
