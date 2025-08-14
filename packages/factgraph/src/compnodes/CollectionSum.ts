import { CompNode, compNodeRegistry, CompNodeFactory } from './CompNode';
import { IntNode } from './IntNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { AggregateExpression } from '../expressions/AggregateExpression';
import { AggregateOperator } from '../operators/AggregateOperator';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { getChildNode } from '../util/getChildNode';
import { Result } from '../types';
import { MaybeVector } from '../types/MaybeVector';
import { Thunk } from '../Thunk';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';

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
      const result = thunk.get;
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

  explain(xs: Expression<T>, factual: Factual): Explanation {
    // TODO: Implement this
    return new Explanation('Sum');
  }
}

export class CollectionSumFactory implements CompNodeFactory {
  readonly typeName = 'CollectionSum';

  create(operands: CompNode[]): CompNode {
    const node = operands[0];
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
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const childNode = getChildNode(e, factual, factDictionary);
    return this.create([childNode]);
  }
}

compNodeRegistry.register(new CollectionSumFactory());
