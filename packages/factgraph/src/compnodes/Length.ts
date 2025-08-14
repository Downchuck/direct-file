import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { StringNode } from './StringNode';
import { IntNode } from './IntNode';
import { UnaryOperator, applyUnary, explainUnary } from '../operators/UnaryOperator';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { UnaryExpression } from '../expressions/UnaryExpression';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';

class LengthOperator implements UnaryOperator<number, string> {
  operation(x: string): number {
    return x.length;
  }
  apply(x: Result<string>): Result<number> {
    return applyUnary(this, x);
  }
  explain(x: Expression<string>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

const lengthOperator = new LengthOperator();

export class LengthFactory implements CompNodeFactory {
  readonly typeName = 'Length';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const node = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      factual,
      factDictionary
    );
    if (!(node instanceof StringNode)) {
      throw new Error('Length can only operate on a StringNode');
    }
    return this.create(node);
  }

  create(node: StringNode): IntNode {
    return new IntNode(new UnaryExpression(node.expr, lengthOperator));
  }
}

compNodeRegistry.register(new LengthFactory());
