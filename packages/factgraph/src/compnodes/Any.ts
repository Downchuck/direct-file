import { CompNode, CompNodeFactory } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { ReduceOperator } from '../operators/ReduceOperator';
import { ReduceExpression } from '../expressions/ReduceExpression';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { Result } from '../types/Result';
import { Thunk } from '../Thunk';
import {
  Explanation,
  opWithInclusiveChildren,
  opWithExclusiveChildren,
  getChildren,
} from '../Explanation';
import { Expression } from '../Expression';
import { compNodeRegistry } from './registry';

class AnyOperator implements ReduceOperator<boolean> {
  reduce(x: boolean, y: boolean): boolean {
    return x || y;
  }

  apply(
    head: Result<boolean>,
    tail: Thunk<Result<boolean>>[]
  ): Result<boolean> {
    if (head.isComplete && head.value === true) {
      return Result.complete(true);
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

    const [thunk, ...rest] = thunks;
    const result = thunk.value;

    if (result.isComplete && result.value === true) {
      return Result.complete(true);
    }

    if (result.isPlaceholder && result.value === true) {
      return this.accumulator(rest, Result.placeholder(true));
    }

    if (result.isIncomplete) {
      if (a.isPlaceholder && a.value === true) {
        return this.accumulator(rest, Result.placeholder(true));
      }
      return this.accumulator(rest, Result.incomplete());
    }

    // result is Complete(false) or Placeholder(false)
    if (a.isComplete) {
      return this.accumulator(rest, result);
    }

    return this.accumulator(rest, a);
  }

  explain(
    xs: Expression<boolean>[],
    factual: Factual
  ): Explanation {
    const cases = xs.map((x) => {
      return {
        thunk: x.getThunk(factual),
        explanation: x.explain(factual),
      };
    });

    return this.explainRecurse(cases, opWithExclusiveChildren([]));
  }

  private explainRecurse(
    cases: {
      thunk: Thunk<Result<boolean>>;
      explanation: Explanation;
    }[],
    explanation: Explanation
  ): Explanation {
    if (cases.length === 0) {
      return explanation;
    }

    const [{ thunk, explanation: xExp }, ...next] = cases;
    const result = thunk.value;

    if (result.isComplete && result.value === true) {
      return opWithInclusiveChildren([xExp]);
    }

    return this.explainRecurse(
      next,
      opWithExclusiveChildren([...getChildren(explanation).flat(), xExp])
    );
  }
}

export const AnyFactory: CompNodeFactory = {
  typeName: 'Any',

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    throw new Error('fromDerivedConfig not implemented for Any');
  },

  create(nodes: CompNode[]): BooleanNode {
    if (nodes.every((n) => n instanceof BooleanNode)) {
      const expressions = nodes.map((n) => (n as BooleanNode).expr);
      return new BooleanNode(new ReduceExpression(expressions, new AnyOperator()));
    }
    throw new Error('all children of <Any> must be BooleanNodes');
  },
};

export const Any = (nodes: BooleanNode[]): BooleanNode => {
  return AnyFactory.create(nodes) as BooleanNode;
};
