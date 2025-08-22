import { AggregateExpression } from '../expressions/AggregateExpression';
import { CompNode, DerivedNodeFactory } from './CompNode';
import { Operator } from '../types/Operator';
import { Result } from '../types/Result';
import { MaybeVector } from '../types/MaybeVector';
import { Thunk } from '../types/Thunk';
import { BooleanNode } from './BooleanNode';
import { DerivedNode } from '../types/Node';
import { Expression } from '../Expression';
import { Graph } from '../Graph';
import { compNodeRegistry } from './registry';

export class CountOperator implements Operator<boolean, number> {
  apply(thunks: MaybeVector<Thunk<Result<boolean>>>): Result<number> {
    if (!thunks.isMultiple) {
      // This is a collection, so if it's not multiple, it's not ready.
      return Result.incomplete();
    }

    let count = 0;
    for (const thunk of thunks.values) {
      const result = thunk.value;
      if (result.hasValue && result.value === true) {
        count++;
      }
    }

    if (thunks.isComplete) {
      return Result.complete(count);
    }
    return Result.placeholder(count);
  }
}

class CountNode extends CompNode {
  public readonly expr: Expression<number>;
  constructor(
    protected readonly children: ReadonlyArray<DerivedNode<any>>,
    private readonly operator: Operator<any, number>
  ) {
    super();
    this.expr = new AggregateExpression(
      children.map((child) => child.out),
      operator
    );
  }

  protected fromExpression(expr: Expression<any>): CompNode {
    throw new Error('Method not implemented.');
  }
}

export const CountFactory: DerivedNodeFactory = {
  typeName: 'Count',

  create(children: ReadonlyArray<DerivedNode<any>>): CompNode {
    return new CountNode(children, new CountOperator());
  },

  fromDerivedConfig(
    config: any,
    graph: Graph,
  ): CompNode {
    const children = config.children.map((child: any) =>
      compNodeRegistry.fromDerivedConfig(child, graph)
    );
    return this.create(children);
  },
};
