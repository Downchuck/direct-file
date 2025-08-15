import {
  CompNode,
  compNodeRegistry,
  DerivedNodeFactory,
} from './CompNode';

import { AggregateExpression, Expression } from '../expressions';
import { AggregateOperator, opWithInclusiveChildren } from '../operators';
import { IntNode } from './IntNode';
import { Explanation, Factual, Graph, MaybeVector, Result, Thunk } from '../types';

class CountOperator implements AggregateOperator<boolean, number> {
  apply(vect: MaybeVector<Thunk<Result<boolean>>>): Result<number> {
    const list = vect.toList;
    if (list.length === 0) {
      return Result.incomplete(0);
    }
    let count = 0;
    let isComplete = true;

    for (let i = 0; i < list.length; i++) {
      const current = list[i].value;
      if (!current.hasValue) {
        return Result.incomplete();
      }
      if (current.get) {
        count++;
      }
      isComplete = isComplete && current.isComplete;
    }

    if (isComplete) {
      return Result.complete(count);
    } else {
      return Result.placeholder(count);
    }
  }

  explain(expression: Expression<boolean>, factual: Factual): Explanation {
    return opWithInclusiveChildren([expression.explain(factual)]);
  }
}

const countOp = new CountOperator();

export class CountFactory implements DerivedNodeFactory {
  readonly typeName = 'Count';

  fromDerivedConfig(e: any, graph: Graph): CompNode {
    const node = compNodeRegistry.fromDerivedConfig(e.children[0], graph);
    return new IntNode(new AggregateExpression(node.expr, countOp));
  }
}

compNodeRegistry.register(new CountFactory());
