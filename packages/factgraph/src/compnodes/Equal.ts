import {
  CompNode,
  CompNodeFactory,
  compNodeRegistry,
} from './CompNode';
import { BooleanNode } from './BooleanNode';
import { Expression } from '../Expression';
import { BinaryOperator } from '../operators/BinaryOperator';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';

class EqualOperator implements BinaryOperator<boolean, any, any> {
  operation(lhs: any, rhs: any): boolean {
    // In scala `==` is null-safe. In JS `===` is not, but `lhs` and `rhs` should not be null.
    return lhs === rhs;
  }
}

class EqualFactory implements CompNodeFactory {
  readonly typeName = 'Equal';
  private readonly operator = new EqualOperator();

  create(lhs: CompNode, rhs: CompNode): BooleanNode {
    if (lhs.constructor !== rhs.constructor) {
      throw new Error(
        `cannot compare a ${lhs.constructor.name} and a ${rhs.constructor.name}`
      );
    }

    return new BooleanNode(
      new BinaryExpression(lhs.expression, rhs.expression, this.operator)
    );
  }

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    // The scala code uses `getConfigChildNode`, which we don't have.
    // We'll have to improvise based on the structure of the config.
    // This is a guess based on the `Add.ts` example.
    const lhs = compNodeRegistry.fromDerivedConfig(
      e.children.find((c: any) => c.key === 'Left'),
      factual,
      factDictionary
    );
    const rhs = compNodeRegistry.fromDerivedConfig(
      e.children.find((c: any) => c.key === 'Right'),
      factual,
      factDictionary
    );

    return this.create(lhs, rhs);
  }
}

compNodeRegistry.register(new EqualFactory());
