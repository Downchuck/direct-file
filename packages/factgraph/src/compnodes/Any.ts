import { CompNode, DerivedNodeFactory } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { ReduceOperator } from '../operators/ReduceOperator';
import { applyReduce, explainReduce } from '../operators/ReduceOperatorHelpers';
import { Factual } from '../Factual';
import { ReduceExpression } from '../expressions/ReduceExpression';
import { Graph } from '../Graph';
import { Result } from '../types';
import { Expression } from '../Expression';
import { Explanation } from '../Explanation';

class AnyOperator implements ReduceOperator<boolean> {
  identity = false;
  reduce = (a: boolean, b: boolean) => a || b;

  apply(results: Result<boolean>[]): Result<boolean> {
    // Short-circuit if any result is a complete true
    const trueResult = results.find(r => r.isComplete && r.value === true);
    if (trueResult) {
      return Result.complete(true);
    }
    return applyReduce(this, results);
  }

  explain(expressions: Expression<boolean>[], factual: Factual): Explanation {
    return explainReduce(expressions, factual);
  }
}

const anyOperator = new AnyOperator();

export const AnyFactory: DerivedNodeFactory = {
  typeName: 'Any',
  fromDerivedConfig(e: any, graph: Graph, children: CompNode[]): CompNode {
    if (!children.every(c => c instanceof BooleanNode)) {
        throw new Error('All children of <Any> must be BooleanNodes');
    }
    return new BooleanNode(new ReduceExpression(anyOperator));
  },
};
