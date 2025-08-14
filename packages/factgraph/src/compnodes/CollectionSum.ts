import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { IntNode } from './IntNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import {
  AggregateOperator,
  applyAggregate,
  explainAggregate,
} from '../operators/AggregateOperator';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { AggregateExpression } from '../expressions/AggregateExpression';
import { Result } from '../types';
import { Thunk } from '../Thunk';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';

// Sum is used across a collection. If you're trying to add
// a number of dependencies, use the `Add` node.

class SumOperator<A> implements AggregateOperator<A, A> {
  constructor(
    private readonly plus: (x: A, y: A) => A,
    private readonly zero: A
  ) {}

  apply(vect: Thunk<Result<A>>[]): Result<A> {
    return applyAggregate(this, vect, this.zero);
  }

  explain(x: Expression<A>, factual: Factual): Explanation {
    return explainAggregate(x, factual);
  }
}

const intPlus = (x: number, y: number) => x + y;
const dollarPlus = (x: Dollar, y: Dollar) => x.add(y);
const rationalPlus = (x: Rational, y: Rational) => x.add(y);

const intOperator = new SumOperator(intPlus, 0);
const dollarOperator = new SumOperator(dollarPlus, Dollar.zero);
const rationalOperator = new SumOperator(rationalPlus, Rational.zero);

export class CollectionSumFactory implements CompNodeFactory {
  readonly typeName = 'CollectionSum';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const child = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      factual,
      factDictionary
    );
    return this.create(child);
  }

  create(node: CompNode): CompNode {
    if (node instanceof IntNode) {
      return new IntNode(new AggregateExpression(node.expr, intOperator));
    }
    if (node instanceof DollarNode) {
      return new DollarNode(new AggregateExpression(node.expr, dollarOperator));
    }
    if (node instanceof RationalNode) {
      return new RationalNode(
        new AggregateExpression(node.expr, rationalOperator)
      );
    }
    throw new Error(`cannot sum a ${node.constructor.name}`);
  }
}

compNodeRegistry.register(new CollectionSumFactory());
