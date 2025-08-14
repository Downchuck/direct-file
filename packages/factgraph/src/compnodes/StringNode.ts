import { Expression } from '../Expression';
import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { WritableNodeFactory } from './WritableNodeFactory';
import { Result } from '../types';

export class StringNode extends CompNode {
  public readonly expr: Expression<string>;

  constructor(expr: Expression<string>) {
    super();
    this.expr = expr;
  }

  protected fromExpression(expr: Expression<string>): CompNode {
    return new StringNode(expr);
  }
}

class StringNodeFactory implements WritableNodeFactory, CompNodeFactory {
  readonly typeName = 'String';

  fromWritableConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    return new StringNode(Expression.literal(Result.incomplete()));
  }

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const value = e.value || '';
    return new StringNode(Expression.literal(Result.complete(value)));
  }
}

compNodeRegistry.register(new StringNodeFactory());
