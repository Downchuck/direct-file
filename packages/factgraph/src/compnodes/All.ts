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

class AllOperator implements ReduceOperator<boolean> {
  identity = true;
  reduce = (a: boolean, b: boolean) => a && b;

  apply(results: Result<boolean>[]): Result<boolean> {
    // Short-circuit if any result is a complete false
    const falseResult = results.find(r => r.isComplete && r.value === false);
    if (falseResult) {
      return Result.complete(false);
    }
    return applyReduce(this, results);
  }

  explain(expressions: Expression<boolean>[], factual: Factual): Explanation {
    // This can be improved, but for now, the default is fine.
    return explainReduce(expressions, factual);
  }
}

const allOperator = new AllOperator();

export const AllFactory: DerivedNodeFactory = {
  typeName: 'All',
  fromDerivedConfig(e: any, graph: Graph, children: CompNode[]): CompNode {
    if (!children.every(c => c instanceof BooleanNode)) {
        throw new Error('All children of <All> must be BooleanNodes');
    }
    return new BooleanNode(new ReduceExpression(allOperator));
  },
};
