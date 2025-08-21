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

export class MaximumOperator<A> implements AggregateOperator<A, A> {
  constructor(private readonly gt: (x: A, y: A) => boolean) {}

  apply(vect: MaybeVector<Thunk<Result<A>>>): Result<A> {
    console.log('MaximumOperator.apply', vect);
    const list = vect.toList;
    if (list.length === 0) {
      return Result.incomplete();
    }
    const results = list.map(t => t.value);
    if (results.some(r => !r.hasValue)) {
        return Result.incomplete();
    }

    const values = results.map(r => r.get);
    let max = values[0];
    for (let i = 1; i < values.length; i++) {
        if (this.gt(values[i], max)) {
            max = values[i];
        }
    }

    if (vect.isComplete) {
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

export const MaximumFactory: DerivedNodeFactory = {
  typeName: 'Maximum',

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
        return new IntNode(new AggregateExpression(node.expr, intMax));
      }
      if (type === 'dollar') {
        return new DollarNode(new AggregateExpression(node.expr, dollarMax));
      }
      if (type === 'rational') {
        return new RationalNode(
          new AggregateExpression(node.expr, rationalMax)
        );
      }
      if (type === 'day') {
        return new DayNode(new AggregateExpression(node.expr, dayMax));
      }
    }

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
  },
};
