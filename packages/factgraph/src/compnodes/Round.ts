import { CompNode, CompNodeFactory } from './CompNode';
import { DollarNode } from './DollarNode';
import { Dollar } from '../types/Dollar';
import { UnaryOperator, applyUnary, explainUnary } from '../operators/UnaryOperator';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { UnaryExpression } from '../expressions/UnaryExpression';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';
import { compNodeRegistry } from './registry';

class RoundOperator implements UnaryOperator<Dollar, Dollar> {
  operation(x: Dollar): Dollar {
    return x.round();
  }
  apply(x: Result<Dollar>): Result<Dollar> {
    return applyUnary(this, x);
  }
  explain(x: Expression<Dollar>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

const roundOperator = new RoundOperator();

export class RoundFactory implements CompNodeFactory {
  readonly typeName = 'Round';

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    const amount = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      graph
    );
    if (!(amount instanceof DollarNode)) {
      throw new Error('Round can only operate on a DollarNode');
    }
    return this.create(amount);
  }

  create(amount: DollarNode): DollarNode {
    return new DollarNode(new UnaryExpression(amount.expr, roundOperator));
  }
}
