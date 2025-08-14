import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { DollarNode } from './DollarNode';
import { IntNode } from './IntNode';
import { Dollar } from '../types/Dollar';
import { UnaryOperator, applyUnary, explainUnary } from '../operators/UnaryOperator';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { UnaryExpression } from '../expressions/UnaryExpression';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';

class RoundToIntOperator implements UnaryOperator<number, Dollar> {
  operation(x: Dollar): number {
    return Math.round(x.round().toNumber());
  }
  apply(x: Result<Dollar>): Result<number> {
    return applyUnary(this, x);
  }
  explain(x: Expression<Dollar>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

const roundToIntOperator = new RoundToIntOperator();

export class RoundToIntFactory implements CompNodeFactory {
  readonly typeName = 'RoundToInt';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const amount = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      factual,
      factDictionary
    );
    if (!(amount instanceof DollarNode)) {
      throw new Error('RoundToInt can only operate on a DollarNode');
    }
    return this.create(amount);
  }

  create(amount: DollarNode): IntNode {
    return new IntNode(new UnaryExpression(amount.expr, roundToIntOperator));
  }
}

compNodeRegistry.register(new RoundToIntFactory());
