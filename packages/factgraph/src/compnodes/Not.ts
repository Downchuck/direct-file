import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { UnaryOperator } from '../operators/UnaryOperator';
import { UnaryExpression } from '../expressions/UnaryExpression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types/Result';
import {
  Explanation,
  opWithExclusiveChildren,
} from '../Explanation';
import { Expression } from '../Expression';

class NotOperator implements UnaryOperator<boolean, boolean> {
  apply(a: Result<boolean>): Result<boolean> {
    return a.map((val) => !val);
  }

  explain(a: Expression<boolean>, factual: Factual): Explanation {
    return opWithExclusiveChildren([a.explain(factual)]);
  }
}

class NotFactory implements CompNodeFactory {
  readonly typeName = 'Not';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const child = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      factual,
      factDictionary
    );

    if (child instanceof BooleanNode) {
      return this.create(child);
    }

    throw new Error('child of <Not> must be a BooleanNode');
  }

  create(node: BooleanNode): BooleanNode {
    return new BooleanNode(new UnaryExpression(node.expr, new NotOperator()));
  }
}

const notCompNodeFactory = new NotFactory();
compNodeRegistry.register(notCompNodeFactory);

export const Not = (node: BooleanNode): BooleanNode => {
  return notCompNodeFactory.create(node);
};
