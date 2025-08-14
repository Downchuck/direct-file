import { Expression } from '../Expression';
import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { BooleanNode } from './BooleanNode';
import { UnaryOperator, applyUnary, explainUnary } from '../operators/UnaryOperator';
import { Result } from '../types';
import { Explanation } from '../Explanation';

class NotOperator implements UnaryOperator<boolean, boolean> {
  operation(x: boolean): boolean {
    return !x;
  }
  apply(x: Result<boolean>): Result<boolean> {
    return applyUnary(this, x);
  }
  explain(x: Expression<boolean>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

class NotFactory implements CompNodeFactory {
  readonly typeName = 'Not';
  private readonly operator = new NotOperator();

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const child = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      factual,
      factDictionary
    );
    if (child instanceof BooleanNode) {
      return new BooleanNode(
        new UnaryExpression(child.expr, this.operator)
      );
    }
    throw new Error('Not must have a boolean child');
  }
}

class UnaryExpression<T, U> extends Expression<T> {
  constructor(
    private readonly x: Expression<U>,
    private readonly op: UnaryOperator<T, U>
  ) {
    super();
  }

  public get(factual: Factual): Result<T> {
    return this.op.apply(this.x.get(factual));
  }

  public explain(factual: Factual): Explanation {
    return this.op.explain(this.x, factual);
  }
}

compNodeRegistry.register(new NotFactory());
