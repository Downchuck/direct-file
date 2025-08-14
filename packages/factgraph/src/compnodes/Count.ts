import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { IntNode } from './IntNode';
import { AggregateOperator } from '../operators/AggregateOperator';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { AggregateExpression } from '../expressions/AggregateExpression';
import { Result } from '../types';
import { Explanation, opWithInclusiveChildren } from '../Explanation';
import { Expression } from '../Expression';
import { MaybeVector } from '../types/MaybeVector';
import { Thunk } from '../Thunk';

export class CountOperator implements AggregateOperator<boolean, number> {
  apply(vect: MaybeVector<Thunk<Result<boolean>>>): Result<number> {
    const list = vect.toList;
    if (list.length === 0) {
      return Result.complete(0);
    }
    let count = 0;
    let isComplete = true;

    for (let i = 0; i < list.length; i++) {
      const current = list[i].get;
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

const countOperator = new CountOperator();

export class CountFactory implements CompNodeFactory {
  readonly typeName = 'Count';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const node = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      factual,
      factDictionary
    );
    if (!(node instanceof BooleanNode)) {
      throw new Error('Count can only operate on a BooleanNode');
    }
    return this.create(node);
  }

  create(node: BooleanNode): IntNode {
    return new IntNode(new AggregateExpression(node.expr, countOperator));
  }
}

compNodeRegistry.register(new CountFactory());
