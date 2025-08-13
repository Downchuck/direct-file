import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { Result } from '../types/Result';
import { Thunk } from '../Thunk';
import { Explanation } from '../Explanation';

export class ExtractExpression<A, B> extends Expression<B> {
  constructor(
    private readonly source: Expression<A>,
    private readonly extractor: (a: Result<A>) => Result<B>
  ) {
    super();
  }

  get(factual: Factual): Result<B> {
    return this.extractor(this.source.get(factual));
  }

  getThunk(factual: Factual): Thunk<Result<B>> {
    return new Thunk(() => this.get(factual));
  }

  explain(factual: Factual): Explanation {
    return this.source.explain(factual);
  }
}
