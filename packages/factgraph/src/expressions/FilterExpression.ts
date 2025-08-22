import { Expression } from './Expression';
import { Factual } from '../Factual';
import { Result } from '../types/Result';
import { CompNode } from '../compnodes/CompNode';
import { BooleanNode } from '../compnodes/BooleanNode';

export class FilterExpression extends Expression<any[]> {
  constructor(
    private readonly collection: Expression<any[]>,
    private readonly item: CompNode,
    private readonly filter: BooleanNode
  ) {
    super();
  }

  get(factual: Factual): Result<any[]> {
    const collectionResult = this.collection.get(factual);
    if (!collectionResult.isComplete) {
      return collectionResult as Result<any[]>;
    }

    const filtered = collectionResult.value.filter((itemValue) => {
      // Create a new Factual with the current item's value in scope for the CollectionItemNode
      const itemFactual = factual.withScope(
        this.item.path,
        Result.complete(itemValue)
      );
      // Evaluate the filter predicate with the new Factual
      const filterResult = this.filter.get(itemFactual);
      // The item is kept if the filter returns true
      return filterResult.isComplete && filterResult.value === true;
    });

    return Result.complete(filtered);
  }

  toString() {
    return `Filter(${this.collection.toString()}, ${this.filter.toString()})`;
  }
}
