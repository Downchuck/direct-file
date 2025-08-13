import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { BinaryOperator } from '../operators/BinaryOperator';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types/Result';
import {
  Explanation,
  opWithExclusiveChildren,
} from '../Explanation';
import { Expression } from '../Expression';

class NotEqualOperator implements BinaryOperator<boolean, any, any> {
  apply(a: Result<any>, b: Result<any>): Result<boolean> {
    return a.flatMap((aValue) => b.map((bValue) => aValue !== bValue));
  }

  explain(a: Expression<any>, b: Expression<any>, factual: Factual): Explanation {
    return opWithExclusiveChildren([a.explain(factual), b.explain(factual)]);
  }
}

class NotEqualFactory implements CompNodeFactory {
  readonly typeName = 'NotEqual';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const lhs = compNodeRegistry.fromDerivedConfig(
      e.children.find((c: any) => c.typeName === 'Left').children[0],
      factual,
      factDictionary
    );
    const rhs = compNodeRegistry.fromDerivedConfig(
      e.children.find((c: any) => c.typeName === 'Right').children[0],
      factual,
      factDictionary
    );

    return this.create(lhs, rhs);
  }

  create(lhs: CompNode, rhs: CompNode): BooleanNode {
    if (lhs.constructor !== rhs.constructor) {
      throw new Error(
        `cannot compare a ${lhs.constructor.name} and a ${rhs.constructor.name}`
      );
    }
    return new BooleanNode(
      new BinaryExpression((lhs as any).expr, (rhs as any).expr, new NotEqualOperator())
    );
  }
}

const notEqualCompNodeFactory = new NotEqualFactory();
compNodeRegistry.register(notEqualCompNodeFactory);

export const NotEqual = (lhs: CompNode, rhs: CompNode): BooleanNode => {
  return notEqualCompNodeFactory.create(lhs, rhs);
};
