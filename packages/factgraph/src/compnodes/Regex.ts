import { CompNode, DerivedNodeFactory } from './CompNode';
import { StringNode } from './StringNode';
import { BooleanNode } from './BooleanNode';
import { BinaryOperator, applyBinary, explainBinary } from '../operators/BinaryOperator';
import { Factual } from '../Factual';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { Graph } from '../Graph';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';

const regexOp = (input: string, pattern: string) => new RegExp(pattern).test(input);

class RegexBinaryOperator implements BinaryOperator<boolean, string, string> {
    operation = regexOp;
    apply = (lhs: Result<string>, rhs: Result<string>) => applyBinary(this, lhs, rhs);
    explain = (lhs: Expression<string>, rhs: Expression<string>, factual: Factual) => explainBinary(lhs, rhs, factual);
}

const regexOperator = new RegexBinaryOperator();

export const RegexFactory: DerivedNodeFactory = {
  typeName: 'Regex',
  fromDerivedConfig(e: any, graph: Graph, children: CompNode[]): CompNode {
    if (children.length !== 2) {
        throw new Error(`Regex expects 2 children, but got ${children.length}`);
    }
    const [inputNode, patternNode] = children;
    if (!(inputNode instanceof StringNode)) {
      throw new Error('Regex `Input` must be a StringNode');
    }
    if (!(patternNode instanceof StringNode)) {
      throw new Error('Regex `Pattern` must be a StringNode');
    }

    return new BooleanNode(new BinaryExpression(regexOperator));
  },
};
