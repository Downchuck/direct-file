import { CompNode, CompNodeFactory } from './CompNode';
import { StringNode } from './StringNode';
import { BooleanNode } from './BooleanNode';
import { BinaryOperator, applyBinary, explainBinary } from '../operators/BinaryOperator';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { compNodeRegistry } from './registry';

class RegexOperator implements BinaryOperator<boolean, string, string> {
  operation(str: string, regex: string): boolean {
    return new RegExp(regex).test(str);
  }
  apply(lhs: Result<string>, rhs: Result<string>): Result<boolean> {
    return applyBinary(this, lhs, rhs);
  }
  explain(
    lhs: Expression<string>,
    rhs: Expression<string>,
    factual: Factual
  ): Explanation {
    return explainBinary(lhs, rhs, factual);
  }
}

const operator = new RegexOperator();

export const RegexFactory: CompNodeFactory = {
  typeName: 'Regex',

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    const lhs = compNodeRegistry.fromDerivedConfig(
      e.children.find((c: any) => c.key === 'Left').children[0],
      graph
    );
    const rhs = compNodeRegistry.fromDerivedConfig(
      e.children.find((c: any) => c.key === 'Right').children[0],
      graph
    );
    return this.create([lhs, rhs]);
  },

  create(nodes: CompNode[]): CompNode {
    const [lhs, rhs] = nodes;
    if (lhs instanceof StringNode && rhs instanceof StringNode) {
      return new BooleanNode(new BinaryExpression(lhs.expr, rhs.expr, operator));
    }
    throw new Error(
      `cannot match a ${lhs.constructor.name} with a ${rhs.constructor.name}`
    );
  },
};
