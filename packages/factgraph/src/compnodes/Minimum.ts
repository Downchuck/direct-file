import { CompNode, DerivedNodeFactory } from './CompNode';
import { DependencyNode } from './Dependency';
import { IntNode } from './IntNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { DayNode } from './DayNode';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { Day } from '../types/Day';
import { AggregateOperator } from '../operators/AggregateOperator';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { AggregateExpression } from '../expressions/AggregateExpression';
import { DependencyExpression } from '../expressions/DependencyExpression';
import { Result } from '../types';
import { Explanation, opWithInclusiveChildren } from '../Explanation';
import { Expression } from '../Expression';
import { MaybeVector } from '../types/MaybeVector';
import { Thunk } from '../Thunk';
import { compNodeRegistry } from './registry';

export class MinimumOperator<A> implements AggregateOperator<A, A> {
  constructor(private readonly lt: (x: A, y: A) => boolean) {}

  apply(vect: MaybeVector<Thunk<Result<A>>>): Result<A> {
    const list = vect.toList;
    if (list.length === 0) {
      return Result.incomplete();
    }
    const head = list[0].value;
    if (!head.hasValue) {
      return Result.incomplete();
    }
    let min = head.get;
    let isComplete = head.isComplete;

    for (let i = 1; i < list.length; i++) {
      const current = list[i].value;
      if (!current.hasValue) {
        return Result.incomplete();
      }
      if (this.lt(current.get, min)) {
        min = current.get;
      }
      isComplete = isComplete && current.isComplete;
    }

    if (isComplete) {
      return Result.complete(min);
    } else {
      return Result.placeholder(min);
    }
  }

  explain(expression: Expression<A>, factual: Factual): Explanation {
    return opWithInclusiveChildren([expression.explain(factual)]);
  }
}

const intLt = (x: number, y: number) => x < y;
const dollarLt = (x: Dollar, y: Dollar) => x.lt(y);
const rationalLt = (x: Rational, y: Rational) => x.lt(y);
const dayLt = (x: Day, y: Day) => x.toDate() < y.toDate();

const intMin = new MinimumOperator(intLt);
const dollarMin = new MinimumOperator(dollarLt);
const rationalMin = new MinimumOperator(rationalLt);
const dayMin = new MinimumOperator(dayLt);

export const MinimumFactory: DerivedNodeFactory = {
  typeName: 'Minimum',

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    return this.create([
      compNodeRegistry.fromDerivedConfig(e.children[0], graph),
    ]);
  },

  create(operands: CompNode[]): CompNode {
    const node = operands[0];
    if (node instanceof DependencyNode) {
      const path = (node.expr as DependencyExpression<any>).path;
      const type = path.items[path.items.length - 1].key;
      if (type === 'int') {
        return new IntNode(new AggregateExpression(node.expr, intMin));
      }
      if (type === 'dollar') {
        return new DollarNode(new AggregateExpression(node.expr, dollarMin));
      }
      if (type === 'rational') {
        return new RationalNode(
          new AggregateExpression(node.expr, rationalMin)
        );
      }
      if (type === 'day') {
        return new DayNode(new AggregateExpression(node.expr, dayMin));
      }
    }

    if (node instanceof IntNode) {
      return new IntNode(new AggregateExpression(node.expr, intMin));
    }
    if (node instanceof DollarNode) {
      return new DollarNode(new AggregateExpression(node.expr, dollarMin));
    }
    if (node instanceof RationalNode) {
      return new RationalNode(new AggregateExpression(node.expr, rationalMin));
    }
    if (node instanceof DayNode) {
      return new DayNode(new AggregateExpression(node.expr, dayMin));
    }
    throw new Error(`cannot execute minimum on a ${node.constructor.name}`);
  },
};
