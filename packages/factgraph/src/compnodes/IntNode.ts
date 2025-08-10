import { Expression } from '../Expression';
import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { WritableNodeFactory } from './WritableNodeFactory';

export class IntNode extends CompNode {
  public readonly expr: Expression<number>;

  constructor(expr: Expression<number>) {
    super();
    this.expr = expr;
  }

  protected fromExpression(expr: Expression<number>): CompNode {
    return new IntNode(expr);
  }
}

class IntNodeFactory implements WritableNodeFactory, CompNodeFactory {
  readonly typeName = 'Int';

  fromWritableConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    return new IntNode(new Expression<number>());
  }

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    // TODO: getOptionValue
    const value = parseInt(e.getOptionValue('value'), 10);
    return new IntNode(new Expression<number>());
  }
}

compNodeRegistry.register(new IntNodeFactory());
