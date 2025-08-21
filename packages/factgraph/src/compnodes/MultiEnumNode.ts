import { CompNode, CompNodeFactory, WritableNodeFactory } from './CompNode';
import { Expression } from '../Expression';
import { MultiEnum } from '../types/MultiEnum';
import { Graph } from '../Graph';
import { Result } from '../types';
import { compNodeRegistry } from './registry';
import { StringNode } from './StringNode';
import { ReduceOperator } from '../operators/ReduceOperator';
import {
  applyReduce,
  explainReduce,
} from '../operators/ReduceOperatorHelpers';
import { Factual } from '../Factual';
import { Explanation } from '../Explanation';
import { Thunk } from '../Thunk';
import { ReduceExpression } from '../expressions/ReduceExpression';

export class MultiEnumNode extends CompNode {
  constructor(public readonly expr: Expression<MultiEnum>) {
    super();
  }

  protected fromExpression(expr: Expression<MultiEnum>): CompNode {
    return new MultiEnumNode(expr);
  }
}

class MultiEnumReduceOperator implements ReduceOperator<string[]> {
  constructor(private readonly options: string[]) {}

  reduce(acc: string[], val: string): string[] {
    return [...acc, val];
  }

  apply(
    head: Result<string[]>,
    tail: Thunk<Result<string[]>>[]
  ): Result<string[]> {
    return applyReduce(this, head, tail).flatMap((arr) => {
      const set = new Set(arr);
      for (const val of set) {
        if (!this.options.includes(val)) {
          return Result.incomplete<string[]>();
        }
      }
      return Result.complete(Array.from(set));
    });
  }

  explain(xs: Expression<string[]>[], factual: Factual): Explanation {
    return explainReduce(xs, factual);
  }
}

export const MultiEnumNodeFactory: CompNodeFactory & WritableNodeFactory = {
  typeName: 'MultiEnum',

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    const children = e.children.map((child: any) =>
      compNodeRegistry.fromDerivedConfig(child, graph)
    );
    return this.create(children, e.options);
  },

  fromWritableConfig(e: any, graph: Graph): CompNode {
    return new MultiEnumNode(Expression.writable(Result.incomplete()));
  },

  create(nodes: CompNode[], options: string[]): CompNode {
    const expressions = nodes.map((n) => {
      if (!(n instanceof StringNode)) {
        throw new Error('MultiEnumNode children must be StringNodes');
      }
      return n.expr;
    });
    return new MultiEnumNode(
      new ReduceExpression(expressions, new MultiEnumReduceOperator(options))
    );
  },
};
