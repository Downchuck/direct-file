import { Expression } from '../Expression';
import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { WritableNodeFactory } from './WritableNodeFactory';
import { Rational } from '../types/Rational';
import { Result } from '../types/Result';

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
    return new RationalNode(Expression.literal(Result.incomplete()));
  }

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    // TODO: getOptionValue
    const value = e.value || '0/1';
    return new RationalNode(
      Expression.literal(Result.complete(Rational.fromString(value)))
    );
  }
}

compNodeRegistry.register(new RationalNodeFactory());
