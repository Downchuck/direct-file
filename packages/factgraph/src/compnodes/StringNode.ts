import { Expression } from '../Expression';
import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { WritableNodeFactory } from './WritableNodeFactory';

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
    return new StringNode(new Expression<string>());
  }

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    // TODO: getOptionValue
    const value = e.getOptionValue('value') || '';
    return new StringNode(new Expression<string>());
  }
}

compNodeRegistry.register(new StringNodeFactory());
