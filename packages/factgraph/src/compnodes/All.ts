import { Expression } from '../Expression';
import { ReduceExpression } from '../expressions/ReduceExpression';
import { BooleanNode } from './BooleanNode';
import { ReduceOperator } from '../operators/ReduceOperator';
import { Result } from '../types';
import { Thunk } from '../Thunk';
import { Explanation, opWithInclusiveChildren } from '../Explanation';
import { Factual } from '../Factual';
import { CompNode, CompNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { compNodeRegistry } from './registry';

class AllOperator implements ReduceOperator<boolean> {
  reduce(x: boolean, y: boolean): boolean {
    return x && y;
  }

  apply(
    head: Result<boolean>,
    tail: Thunk<Result<boolean>>[]
  ): Result<boolean> {
    if (head.isComplete && !head.value) {
      return Result.complete(false);
    }

    return this.accumulator(tail, head);
  }

  private accumulator(
    thunks: Thunk<Result<boolean>>[],
    a: Result<boolean>
  ): Result<boolean> {
    if (thunks.length === 0) {
      return a;
    }

    const [head, ...tail] = thunks;
    const result = head.value;

    if (result.isComplete && !result.get) {
      return Result.complete(false);
    }

    const nextA: Result<boolean> = a.flatMap((aValue) =>
      result.map((rValue) => aValue && rValue)
    );
    return this.accumulator(tail, nextA);
  }

  explain(xs: Expression<boolean>[], factual: Factual): Explanation {
    const caseVectors = xs.map((x) => ({
      thunk: x.getThunk(factual),
      explanation: x.explain(factual),
    }));

    for (const { thunk, explanation } of caseVectors) {
      const result = thunk.value;
      if (result.isComplete && !result.value) {
        return opWithInclusiveChildren([explanation]);
      }
    }

    return opWithInclusiveChildren(caseVectors.map((c) => c.explanation));
  }
}

const allOperator = new AllOperator();

export const AllFactory: CompNodeFactory = {
  typeName: 'All',

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    throw new Error('fromDerivedConfig not implemented for All');
  },

  create(nodes: CompNode[]): BooleanNode {
    if (nodes.every((n) => n instanceof BooleanNode)) {
      const expressions = nodes.map((n) => (n as BooleanNode).expr);
      return new BooleanNode(new ReduceExpression(expressions, allOperator));
    }
    throw new Error('All children of <All> must be BooleanNodes');
  },
};

export const All = (nodes: BooleanNode[]): BooleanNode => {
  return AllFactory.create(nodes) as BooleanNode;
};
