import { Expression } from '../Expression';
import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { WritableNodeFactory } from './WritableNodeFactory';
import { Days } from '../types/Days';
import { Result } from '../types/Result';

export class DaysNode extends CompNode {
  public readonly expr: Expression<Days>;

  constructor(expr: Expression<Days>) {
    super();
    this.expr = expr;
  }

  protected fromExpression(expr: Expression<Days>): CompNode {
    return new DaysNode(expr);
  }
}

class DaysNodeFactory implements WritableNodeFactory, CompNodeFactory {
  readonly typeName = 'Days';

  fromWritableConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    return new DaysNode(Expression.literal(Result.incomplete()));
  }

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    // TODO: getOptionValue
    const value = e.value || '0';
    return new DaysNode(
      Expression.literal(Result.complete(new Days(parseInt(value, 10))))
    );
  }
}

compNodeRegistry.register(new DaysNodeFactory());
