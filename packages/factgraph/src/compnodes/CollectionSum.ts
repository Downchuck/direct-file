import { CompNode, DerivedNodeFactory } from './CompNode';
import { IntNode } from './IntNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { AggregateExpression } from '../expressions/AggregateExpression';
import { AggregateOperator } from '../operators/AggregateOperator';
import { Graph } from '../Graph';
import { Result } from '../types';
import { MaybeVector } from '../types/MaybeVector';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';
import { Factual } from '../Factual';

class SumOperator<T extends number | Dollar | Rational> implements AggregateOperator<T, T> {
  constructor(private readonly zero: T) {}

  apply(vect: MaybeVector<Result<T>>): Result<T> {
    if (!vect.isComplete) {
        return Result.incomplete();
    }

    let sum: T = this.zero;
    for (const result of vect.values) {
        if (!result.hasValue) {
            return Result.incomplete();
        }
        if (typeof sum === 'number' && typeof result.get === 'number') {
            sum = (sum + result.get) as T;
        } else if (sum instanceof Dollar && result.get instanceof Dollar) {
            sum = sum.add(result.get) as T;
        } else if (sum instanceof Rational && result.get instanceof Rational) {
            sum = sum.add(result.get) as T;
        }
    }
    return Result.complete(sum);
  }

  explain(xs: Expression<T>, graph: Factual): Explanation {
    return new Explanation('Sums the values in a collection');
  }
}

export const CollectionSumFactory: DerivedNodeFactory = {
  typeName: 'CollectionSum',
  fromDerivedConfig(e: any, graph: Graph, children: CompNode[]): CompNode {
    if (children.length !== 1) {
      throw new Error(`CollectionSum expects 1 child, but got ${children.length}`);
    }
    const child = children[0];

    if (child instanceof IntNode) {
        return new IntNode(new AggregateExpression(new SumOperator(0)));
    }
    if (child instanceof DollarNode) {
        return new DollarNode(new AggregateExpression(new SumOperator(Dollar.zero)));
    }
    if (child instanceof RationalNode) {
        return new RationalNode(new AggregateExpression(new SumOperator(Rational.zero)));
    }
    throw new Error(`cannot sum a collection of ${child.constructor.name}`);
  }
};
