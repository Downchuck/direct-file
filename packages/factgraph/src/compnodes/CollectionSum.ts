import { CompNode, DerivedNodeFactory } from './CompNode';
import { DependencyNode } from './Dependency';
import { IntNode } from './IntNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { AggregateExpression } from '../expressions/AggregateExpression';
import { AggregateOperator } from '../operators/AggregateOperator';
import { Graph } from '../Graph';
import { getChildNode } from '../util/getChildNode';
import { Result } from '../types';
import { MaybeVector } from '../types/MaybeVector';
import { Thunk } from '../Thunk';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { Explanation, opWithInclusiveChildren } from '../Explanation';
import { Expression } from '../Expression';
import { DependencyExpression } from '../expressions/DependencyExpression';

class SumOperator<T extends number | Dollar | Rational>
  implements AggregateOperator<T, T>
{
  private zero: T;

  constructor(zero: T) {
    this.zero = zero;
  }

  apply(vect: MaybeVector<Thunk<Result<T>>>): Result<T> {
    const thunks = vect.values;
    let sum: T = this.zero;

    for (const thunk of thunks) {
      const result = thunk.value;
      if (result.hasValue) {
        if (typeof sum === 'number' && typeof result.get === 'number') {
          sum = (sum + result.get) as T;
        } else if (sum instanceof Dollar && result.get instanceof Dollar) {
          sum = sum.add(result.get) as T;
        } else if (
          sum instanceof Rational &&
          result.get instanceof Rational
        ) {
          sum = sum.add(result.get) as T;
        }
      }
    }

    if (vect.isComplete) {
      return Result.complete(sum);
    }
    return Result.placeholder(sum);
  }

  explain(xs: Expression<T>, graph: Graph): Explanation {
    return opWithInclusiveChildren([xs.explain(graph)]);
  }
}

export class CollectionSumFactory implements DerivedNodeFactory {
  readonly typeName = 'CollectionSum';

  create(operands: CompNode[]): CompNode {
    const node = operands[0];
    if (node instanceof DependencyNode) {
        const path = (node.expr as DependencyExpression<any>).path;
        const type = path.items[path.items.length - 1].key;
        if (type === 'int') {
            return new IntNode(new AggregateExpression(node.expr, new SumOperator(0)));
        }
        if (type === 'dollar') {
            return new DollarNode(new AggregateExpression(node.expr, new SumOperator(Dollar.zero)));
        }
        if (type === 'rational') {
            return new RationalNode(new AggregateExpression(node.expr, new SumOperator(Rational.zero)));
        }
    }

    if (node instanceof IntNode) {
      return new IntNode(
        new AggregateExpression(node.expr, new SumOperator(0))
      );
    }
    if (node instanceof DollarNode) {
      return new DollarNode(
        new AggregateExpression(node.expr, new SumOperator(Dollar.zero))
      );
    }
    if (node instanceof RationalNode) {
      return new RationalNode(
        new AggregateExpression(node.expr, new SumOperator(Rational.zero))
      );
    }
    throw new Error(`cannot sum a ${node.constructor.name}`);
  }

  fromDerivedConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    const childNode = getChildNode(e, graph);
    return this.create([childNode]);
  }
}
