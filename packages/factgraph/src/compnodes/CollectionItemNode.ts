import { CompNode } from './CompNode';
import { Expression } from '../expressions/Expression';
import { Factual } from '../Factual';
import { Result } from '../types/Result';
import { Path } from '../Path';

/**
 * This node is a special placeholder used by collection operators
 * like Filter and Find to represent the item being iterated over.
 * Its value is not derived from the graph but is provided contextually
 * by the operator that is using it.
 */
export class CollectionItemNode extends CompNode<any> {
  constructor() {
    // The expression is a dummy because this node's get method is overridden.
    super(
      new (class extends Expression<any> {
        get(): Result<any> {
          // This should never be called.
          return Result.incomplete();
        }
        toString() {
          return 'CollectionItemExpression';
        }
      })()
    );
    // Give it a special, recognizable path. This assumes that nested
    // operators will work correctly with Factual scoping.
    this.path = Path.fromString('$item');
  }

  /**
   * Overrides the default CompNode behavior to look up the value from the
   * Factual's contextual scope. This scope is populated by the collection
   * operator (e.g., FilterExpression) that is currently iterating.
   */
  public override get(
    factual: Factual,
    ..._children: Expression<any>[]
  ): Result<any> {
    // Factual.get will check its contextualScope first.
    // FilterExpression/FindExpression will have put the current item's
    // value there, keyed by this node's path.
    return factual.get(this.path);
  }
}
