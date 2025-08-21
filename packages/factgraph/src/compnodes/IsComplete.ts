import { CompNode, CompNodeFactory } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { UnaryOperator, applyUnary, explainUnary } from '../operators/UnaryOperator';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { UnaryExpression } from '../expressions/UnaryExpression';
import { compNodeRegistry } from './registry';

class IsCompleteOperator implements UnaryOperator<boolean, any> {
  operation(x: any): boolean {
    return true;
  }
  apply(x: Result<any>): Result<boolean> {
    return Result.complete(x.isComplete);
  }
  explain(x: Expression<any>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

const operator = new IsCompleteOperator();

export const IsCompleteFactory: CompNodeFactory = {
  typeName: 'IsComplete',

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    const child = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      graph
    );
    return this.create([child]);
  },

  create(nodes: CompNode[]): CompNode {
    const child = nodes[0];
    return new BooleanNode(new UnaryExpression(child.expr, operator));
  },
};
