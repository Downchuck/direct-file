import { CompNode, CompNodeFactory } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { EnumOptionsNode } from './EnumOptionsNode';
import { StringNode } from './StringNode';
import { BinaryOperator, applyBinary, explainBinary } from '../operators/BinaryOperator';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { compNodeRegistry } from './register-factories';

class EnumOptionsContainsOperator implements BinaryOperator<boolean, string[], string> {
  operation(options: string[], value: string): boolean {
    return options.includes(value);
  }
  apply(lhs: Result<string[]>, rhs: Result<string>): Result<boolean> {
    return applyBinary(this, lhs, rhs);
  }
  explain(
    lhs: Expression<string[]>,
    rhs: Expression<string>,
    factual: Factual
  ): Explanation {
    return explainBinary(lhs, rhs, factual);
  }
}

const operator = new EnumOptionsContainsOperator();

export const EnumOptionsContainsFactory: CompNodeFactory = {
  typeName: 'EnumOptionsContains',

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
    if (lhs instanceof EnumOptionsNode && rhs instanceof StringNode) {
      return new BooleanNode(new BinaryExpression(lhs.expr, rhs.expr, operator));
    }
    throw new Error(
      `cannot check if a ${lhs.constructor.name} contains a ${rhs.constructor.name}`
    );
  },
};
