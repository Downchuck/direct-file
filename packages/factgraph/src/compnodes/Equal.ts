import {
  CompNode,
  CompNodeFactory,
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
import { Graph } from '../Graph';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { compNodeRegistry } from './registry';

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

export class EqualFactory implements CompNodeFactory {
  readonly typeName = 'Equal';
  private readonly operator = new EqualOperator();

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    const lhs = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      graph
    );
    const rhs = compNodeRegistry.fromDerivedConfig(
      e.children[1],
      graph
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
