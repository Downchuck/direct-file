import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { getChildNode } from '../util/getChildNode';
import { StringNode } from './StringNode';
import { BooleanNode } from './BooleanNode';
import { BinaryOperator } from '../operators';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { applyBinary } from '../operators/BinaryOperatorHelpers';
import { Result } from '../types';

const RegexOperator: BinaryOperator<boolean, string, string> = {
  name: 'Regex',
  isCommutative: false,
  operation: (input, pattern) => new RegExp(pattern).test(input),
  apply: (lhs: Result<string>, rhs: Result<string>) =>
    applyBinary({ operation: RegexOperator.operation }, lhs, rhs),
  explain: (l, r, f) => new (f.Explanation)(),
};

export const RegexFactory: DerivedNodeFactory = {
  typeName: 'Regex',
  fromDerivedConfig(e: any, graph: Graph): CompNode {
    const inputNode = getChildNode(e.Input, graph);
    const patternNode = getChildNode(e.Pattern, graph);

    if (!(inputNode instanceof StringNode)) {
      throw new Error('Regex `Input` must be a StringNode');
    }
    if (!(patternNode instanceof StringNode)) {
      throw new Error('Regex `Pattern` must be a StringNode');
    }

    return new BooleanNode(
      new BinaryExpression(inputNode.expr, patternNode.expr, RegexOperator)
    );
  },
};
