import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { IntNode } from './IntNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { DayNode } from './DayNode';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { Day } from '../types/Day';
import { AggregateOperator } from '../operators/AggregateOperator';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { AggregateExpression } from '../expressions/AggregateExpression';
import { Result } from '../types';
import { Explanation, opWithInclusiveChildren } from '../Explanation';
import { Expression } from '../Expression';
import { MaybeVector } from '../types/MaybeVector';
import { Thunk } from '../Thunk';

export class MaximumOperator<A> implements AggregateOperator<A, A> {
  constructor(private readonly gt: (x: A, y: A) => boolean) {}

  apply(vect: MaybeVector<Thunk<Result<A>>>): Result<A> {
    const list = vect.toList;
    if (list.length === 0) {
      return Result.incomplete();
    }
    const head = list[0].get;
    if (!head.hasValue) {
      return Result.incomplete();
    }
    let max = head.get;
    let isComplete = head.isComplete;

    for (let i = 1; i < list.length; i++) {
      const current = list[i].get;
      if (!current.hasValue) {
        return Result.incomplete();
      }
      if (this.gt(current.get, max)) {
        max = current.get;
      }
      isComplete = isComplete && current.isComplete;
    }

    if (isComplete) {
      return Result.complete(max);
    } else {
      return Result.placeholder(max);
    }
  }

  explain(expression: Expression<A>, factual: Factual): Explanation {
    return opWithInclusiveChildren([expression.explain(factual)]);
  }
}

const intGt = (x: number, y: number) => x > y;
const dollarGt = (x: Dollar, y: Dollar) => x.gt(y);
const rationalGt = (x: Rational, y: Rational) => x.gt(y);
const dayGt = (x: Day, y: Day) => x.toDate() > y.toDate();

const intMax = new MaximumOperator(intGt);
const dollarMax = new MaximumOperator(dollarGt);
const rationalMax = new MaximumOperator(rationalGt);
const dayMax = new MaximumOperator(dayGt);

export class MaximumFactory implements CompNodeFactory {
  readonly typeName = 'Maximum';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    return this.create(
      compNodeRegistry.fromDerivedConfig(e.children[0], factual, factDictionary)
    );
  }

  create(node: CompNode): CompNode {
    if (node instanceof IntNode) {
      return new IntNode(new AggregateExpression(node.expr, intMax));
    }
    if (node instanceof DollarNode) {
      return new DollarNode(new AggregateExpression(node.expr, dollarMax));
    }
    if (node instanceof RationalNode) {
      return new RationalNode(new AggregateExpression(node.expr, rationalMax));
    }
    if (node instanceof DayNode) {
      return new DayNode(new AggregateExpression(node.expr, dayMax));
    }
    throw new Error(`cannot execute maximum on a ${node.constructor.name}`);
  }
}

compNodeRegistry.register(new MaximumFactory());
