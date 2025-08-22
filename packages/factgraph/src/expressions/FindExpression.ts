import { Expression } from './Expression';
import { Factual } from '../Factual';
import { Result } from '../types/Result';
import { CompNode } from '../compnodes/CompNode';
import { BooleanNode } from '../compnodes/BooleanNode';

export class FindExpression extends Expression<any> {
  constructor(
    private readonly collection: Expression<any[]>,
    private readonly item: CompNode,
    private readonly filter: BooleanNode
  ) {
    super();
  }

  get(factual: Factual): Result<any> {
    const collectionResult = this.collection.get(factual);
    if (!collectionResult.isComplete) {
      return collectionResult;
    }

    const found = collectionResult.value.find((itemValue) => {
      const itemFactual = factual.withScope(
        this.item.path,
        Result.complete(itemValue)
      );
      const filterResult = this.filter.get(itemFactual);
      return filterResult.isComplete && filterResult.value === true;
    });

    if (found !== undefined) {
      return Result.complete(found);
    }

    return Result.incomplete(); // Or should this be complete with undefined? Incomplete seems more correct.
  }

  toString() {
    return `Find(${this.collection.toString()}, ${this.filter.toString()})`;
  }
}
