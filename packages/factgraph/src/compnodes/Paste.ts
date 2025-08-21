import { CompNode, CompNodeFactory } from './CompNode';
import { StringNode } from './StringNode';
import { ReduceOperator, applyReduce, explainReduce } from '../operators/ReduceOperator';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { ReduceExpression } from '../expressions/ReduceExpression';
import { compNodeRegistry } from './registry';
import { Thunk } from '../Thunk';

class PasteOperator implements ReduceOperator<string> {
  reduce(x: string, y: string): string {
    return x + y;
  }
  apply(head: Result<string>, tail: Thunk<Result<string>>[]): Result<string> {
    return applyReduce(this, head, tail);
  }
  explain(xs: Expression<string>[], factual: Factual): Explanation {
    return explainReduce(xs, factual);
  }
}

const operator = new PasteOperator();

export const PasteFactory: CompNodeFactory = {
  typeName: 'Paste',

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    const children = e.children.map((child: any) =>
      compNodeRegistry.fromDerivedConfig(child, graph)
    );
    return this.create(children);
  },

  create(nodes: CompNode[]): CompNode {
    if (nodes.every((n) => n instanceof StringNode)) {
      const expressions = nodes.map((n) => (n as StringNode).expr);
      return new StringNode(new ReduceExpression(expressions, operator));
    }
    throw new Error('All children of <Paste> must be StringNodes');
  },
};
