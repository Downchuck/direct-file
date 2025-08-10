import { Expression } from '../Expression';
import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { WritableNodeFactory } from './WritableNodeFactory';

export class BooleanNode extends CompNode {
  public readonly expr: Expression<boolean>;

  constructor(expr: Expression<boolean>) {
    super();
    this.expr = expr;
  }

  protected fromExpression(expr: Expression<boolean>): CompNode {
    return new BooleanNode(expr);
  }
}

class BooleanNodeFactory implements WritableNodeFactory {
  readonly typeName = 'Boolean';

  fromWritableConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    return new BooleanNode(new Expression<boolean>());
  }
}

class TrueFactory implements CompNodeFactory {
  readonly typeName = 'True';
  private readonly node = new BooleanNode(new Expression<boolean>());

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    return this.node;
  }
}

class FalseFactory implements CompNodeFactory {
  readonly typeName = 'False';
  private readonly node = new BooleanNode(new Expression<boolean>());

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    return this.node;
  }
}

compNodeRegistry.register(new BooleanNodeFactory());
compNodeRegistry.register(new TrueFactory());
compNodeRegistry.register(new FalseFactory());
