import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { ReduceOperator } from '../operators/ReduceOperator';
import { ReduceExpression } from '../expressions/ReduceExpression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types/Result';
import { Thunk } from '../Thunk';
import {
  Explanation,
  opWithInclusiveChildren,
  opWithExclusiveChildren,
  getChildren,
} from '../Explanation';
import { Expression } from '../Expression';

class AllOperator implements ReduceOperator<boolean> {
  reduce(x: boolean, y: boolean): boolean {
    return x && y;
  }

  apply(
    head: Result<boolean>,
    tail: Thunk<Result<boolean>>[]
  ): Result<boolean> {
    if (head.isComplete && head.value === false) {
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

    const [thunk, ...rest] = thunks;
    const result = thunk.get;

    if (result.isComplete && result.value === false) {
      return Result.complete(false);
    }

    if (result.isPlaceholder && result.value === false) {
      return this.accumulator(rest, Result.placeholder(false));
    }

    if (result.isIncomplete) {
      if (a.isPlaceholder && a.value === false) {
        return this.accumulator(rest, Result.placeholder(false));
      }
      return this.accumulator(rest, Result.incomplete());
    }

    // result is Complete(true) or Placeholder(true)
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
    const result = thunk.get;

    if (result.isComplete && result.value === false) {
      return opWithInclusiveChildren([xExp]);
    }

    return this.explainRecurse(
      next,
      opWithExclusiveChildren([...getChildren(explanation).flat(), xExp])
    );
  }
}

class AllFactory implements CompNodeFactory {
  readonly typeName = 'All';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const conditions = e.children.map((child: any) =>
      compNodeRegistry.fromDerivedConfig(child, factual, factDictionary)
    );

    if (conditions.every((c: any) => c instanceof BooleanNode)) {
      return this.create(conditions);
    }

    throw new Error('all children of <All> must be BooleanNodes');
  }

  create(nodes: BooleanNode[]): BooleanNode {
    const expressions = nodes.map((n) => n.expr);
    return new BooleanNode(new ReduceExpression(expressions, new AllOperator()));
  }
}

const allCompNodeFactory = new AllFactory();
compNodeRegistry.register(allCompNodeFactory);

export const All = (nodes: BooleanNode[]): BooleanNode => {
  return allCompNodeFactory.create(nodes);
};
