import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { BooleanNode } from './BooleanNode';
import {
  BinaryOperator,
  applyBinary,
  explainBinary,
} from '../operators/BinaryOperator';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';

class NotEqualBinaryOperator implements BinaryOperator<boolean, any, any> {
  operation(lhs: any, rhs: any): boolean {
    if (lhs && typeof lhs.equals === 'function') {
      return !lhs.equals(rhs);
    }
    return lhs !== rhs;
  }
  apply(lhs: Result<any>, rhs: Result<any>): Result<boolean> {
    return applyBinary(this, lhs, rhs);
  }
  explain(
    lhs: Expression<any>,
    rhs: Expression<any>,
    factual: Factual
  ): Explanation {
    return explainBinary(lhs, rhs, factual);
  }
}

const notEqualOperator = new NotEqualBinaryOperator();

export class NotEqualFactory implements CompNodeFactory {
  readonly typeName = 'NotEqual';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const lhs = compNodeRegistry.fromDerivedConfig(
      e.children.find((c: any) => c.key === 'Left').children[0],
      factual,
      factDictionary
    );
    const rhs = compNodeRegistry.fromDerivedConfig(
      e.children.find((c: any) => c.key === 'Right').children[0],
      factual,
      factDictionary
    );
    return this.create(lhs, rhs);
  }

  create(lhs: CompNode, rhs: CompNode): CompNode {
    if (lhs.constructor.name !== rhs.constructor.name) {
      throw new Error(
        `cannot compare a ${lhs.constructor.name} and a ${rhs.constructor.name}`
      );
    }
    return new BooleanNode(
      new BinaryExpression(lhs.expr, rhs.expr, notEqualOperator)
    );
  }
}

compNodeRegistry.register(new NotEqualFactory());
