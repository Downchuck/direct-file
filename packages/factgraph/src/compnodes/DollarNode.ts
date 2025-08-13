import { Expression } from '../Expression';
import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { WritableNodeFactory } from './WritableNodeFactory';
import { Dollar } from '../types/Dollar';
import { Result } from '../types/Result';

export class DollarNode extends CompNode {
  public readonly expr: Expression<Dollar>;

  constructor(expr: Expression<Dollar>) {
    super();
    this.expr = expr;
  }

  protected fromExpression(expr: Expression<Dollar>): CompNode {
    return new DollarNode(expr);
  }
}

class DollarNodeFactory implements WritableNodeFactory, CompNodeFactory {
  readonly typeName = 'Dollar';

  fromWritableConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    return new DollarNode(Expression.literal(Result.incomplete()));
  }

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    // TODO: getOptionValue
    const value = e.value || '0';
    return new DollarNode(
      Expression.literal(Result.complete(Dollar.fromString(value)))
    );
  }
}

compNodeRegistry.register(new DollarNodeFactory());
