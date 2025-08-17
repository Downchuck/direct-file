import { Expression } from '../Expression';
import { CompNode, CompNodeFactory } from './CompNode';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { BooleanNode } from './BooleanNode';
import { UnaryOperator, applyUnary, explainUnary } from '../operators/UnaryOperator';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { compNodeRegistry } from './registry';
import { UnaryExpression } from '../expressions/UnaryExpression';

class NotOperator implements UnaryOperator<boolean, boolean> {
  operation(x: boolean): boolean {
    return !x;
  }
  apply(x: Result<boolean>): Result<boolean> {
    return applyUnary(this, x);
  }
  explain(x: Expression<boolean>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

export class NotFactory implements CompNodeFactory {
  readonly typeName = 'Not';
  private readonly operator = new NotOperator();

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    const child = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      graph
    );
    if (child instanceof BooleanNode) {
      return new BooleanNode(
        new UnaryExpression(child.expr, this.operator)
      );
    }
    throw new Error('Not must have a boolean child');
  }
}
