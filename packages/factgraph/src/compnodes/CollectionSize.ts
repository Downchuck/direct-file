import { CompNode, compNodeRegistry, CompNodeFactory } from './CompNode';
import { CollectionNode } from './CollectionNode';
import { IntNode } from './IntNode';
import { UnaryExpression } from '../expressions/UnaryExpression';
import { Collection } from '../types/Collection';
import {
  UnaryOperator,
  applyUnary,
  explainUnary,
} from '../operators/UnaryOperator';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { getChildNode } from '../util/getChildNode';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';

export class CollectionSizeOperator implements UnaryOperator<number, Collection> {
  operation(x: Collection): number {
    return x.values.length;
  }

  apply(x: Result<Collection>): Result<number> {
    return applyUnary(this, x);
  }

  explain(x: Expression<Collection>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

export class CollectionSizeFactory implements CompNodeFactory {
  readonly typeName = 'CollectionSize';
  private readonly operator = new CollectionSizeOperator();

  create(operands: CompNode[]): CompNode {
    if (operands.length !== 1 || !(operands[0] instanceof CollectionNode)) {
      throw new Error('CollectionSize requires a single CollectionNode operand');
    }
    const collectionNode = operands[0] as CollectionNode;
    return new IntNode(
      new UnaryExpression(collectionNode.expr, this.operator)
    );
  }

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const childNode = getChildNode(e, factual, factDictionary);
    if (childNode instanceof CollectionNode) {
      return this.create([childNode]);
    }
    throw new Error(`invalid child type: ${childNode.constructor.name}`);
  }
}

compNodeRegistry.register(new CollectionSizeFactory());
