import {
  CompNode,
  CompNodeFactory,
  compNodeRegistry,
} from './CompNode';
import { BooleanNode } from './BooleanNode';
import { Expression } from '../Expression';
import {
  BinaryOperator,
  applyBinary,
  explainBinary,
} from '../operators/BinaryOperator';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';
import { Explanation } from '../Explanation';

class EqualOperator implements BinaryOperator<boolean, any, any> {
  operation(lhs: any, rhs: any): boolean {
    // In scala `==` is null-safe. In JS `===` is not, but `lhs` and `rhs` should not be null.
    return lhs === rhs;
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

class EqualFactory implements CompNodeFactory {
  readonly typeName = 'Equal';
  private readonly operator = new EqualOperator();

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

  create(lhs: CompNode, rhs: CompNode): BooleanNode {
    if (lhs.constructor !== rhs.constructor) {
      throw new Error(
        `cannot compare a ${lhs.constructor.name} and a ${rhs.constructor.name}`
      );
    }

    return new BooleanNode(
      new BinaryExpression(lhs.expr, rhs.expr, this.operator)
    );
  }
}

compNodeRegistry.register(new EqualFactory());
