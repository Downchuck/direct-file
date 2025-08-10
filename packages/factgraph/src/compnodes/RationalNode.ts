import { Expression } from '../Expression';
import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { WritableNodeFactory } from './WritableNodeFactory';
import { Rational } from '../types/Rational';

export class RationalNode extends CompNode {
  public readonly expr: Expression<Rational>;

  constructor(expr: Expression<Rational>) {
    super();
    this.expr = expr;
  }

  protected fromExpression(expr: Expression<Rational>): CompNode {
    return new RationalNode(expr);
  }
}

class RationalNodeFactory implements WritableNodeFactory, CompNodeFactory {
  readonly typeName = 'Rational';

  fromWritableConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    return new RationalNode(new Expression<Rational>());
  }

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    // TODO: getOptionValue
    const value = e.getOptionValue('value') || '0/1';
    return new RationalNode(new Expression<Rational>());
  }
}

compNodeRegistry.register(new RationalNodeFactory());
