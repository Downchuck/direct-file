import {
  CompNode,
  CompNodeFactory,
} from './CompNode';
import { ReduceOperator } from '../operators/ReduceOperator';
import { ReduceExpression } from '../expressions/ReduceExpression';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { Result } from '../types/Result';
import { Thunk } from '../Thunk';
import { Expression } from '../Expression';
import { IntNode } from './IntNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { DayNode } from './DayNode';
import { Explanation, opWithInclusiveChildren } from '../Explanation';
import { compNodeRegistry } from './register-factories';

class GreaterOfOperator<T> implements ReduceOperator<T> {
  constructor(private valueExtractor: (item: T) => number) {}

  reduce(x: T, y: T): T {
    return this.valueExtractor(x) > this.valueExtractor(y) ? x : y;
  }

  apply(head: Result<T>, tail: Thunk<Result<T>>[]): Result<T> {
    return tail.reduce(
      (acc, thunk) =>
        acc.flatMap((a) => thunk.value.map((b) => this.reduce(a, b))),
      head,
    );
  }

  explain(xs: Expression<T>[], factual: Factual): Explanation {
    const explanations = xs.map((x) => x.explain(factual));
    return opWithInclusiveChildren(explanations);
  }
}

export const GreaterOfFactory: CompNodeFactory = {
  typeName: 'GreaterOf',

  fromDerivedConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    throw new Error('fromDerivedConfig not implemented for GreaterOf');
  },

  create(nodes: CompNode[]): CompNode {
    if (nodes.every((n) => n instanceof IntNode)) {
      const expressions = nodes.map((n) => (n as IntNode).expr);
      return new IntNode(
        new ReduceExpression(
          expressions,
          new GreaterOfOperator<number>((n) => n),
        ),
      );
    }
    if (nodes.every((n) => n instanceof DollarNode)) {
      const expressions = nodes.map((n) => (n as DollarNode).expr);
      return new DollarNode(
        new ReduceExpression(
          expressions,
          new GreaterOfOperator<any>((d) => d.value),
        ),
      );
    }
    if (nodes.every((n) => n instanceof RationalNode)) {
      const expressions = nodes.map((n) => (n as RationalNode).expr);
      return new RationalNode(
        new ReduceExpression(
          expressions,
          new GreaterOfOperator<any>((r) => r.value),
        ),
      );
    }
    if (nodes.every((n) => n instanceof DayNode)) {
      const expressions = nodes.map((n) => (n as DayNode).expr);
      return new DayNode(
        new ReduceExpression(
          expressions,
          new GreaterOfOperator<any>((d) => d.value),
        ),
      );
    }
    throw new Error('GreaterOf requires all children to be of the same type');
  },
};

export const GreaterOf = (nodes: CompNode[]): CompNode => {
  return GreaterOfFactory.create(nodes);
};
