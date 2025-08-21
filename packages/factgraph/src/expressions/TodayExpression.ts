import { Expression } from '../Expression';
import { Day } from '../types/Day';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Explanation } from '../Explanation';

export class TodayExpression extends Expression<Day> {
  constructor(private readonly offsetExpr: Expression<number>) {
    super();
  }

  override get(factual: Factual): Result<Day> {
    const offsetResult = this.offsetExpr.get(factual);
    if (!offsetResult.isComplete) {
      return Result.incomplete();
    }
    const offset = offsetResult.value;
    const now = new Date();
    const zonedDate = new Date(now.getTime() + offset * 60 * 60 * 1000);
    return Result.complete(Day.fromDate(zonedDate));
  }

  override explain(factual: Factual): Explanation {
    return this.offsetExpr.explain(factual);
  }
}
