import { Expression } from '../Expression';
import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { WritableNodeFactory } from './WritableNodeFactory';
import { Result } from '../types/Result';

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
    return new IntNode(Expression.literal(Result.incomplete()));
  }

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    // TODO: getOptionValue
    const value = parseInt(e.value, 10);
    return new IntNode(Expression.literal(Result.complete(value)));
  }
}

compNodeRegistry.register(new IntNodeFactory());
