import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { RationalNode } from './RationalNode';
import { StringNode } from './StringNode';
import { Rational } from '../types/Rational';
import { UnaryOperator, applyUnary, explainUnary } from '../operators/UnaryOperator';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { UnaryExpression } from '../expressions/UnaryExpression';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';
import { Decimal } from 'decimal.js';

class RationalAsDecimalString implements UnaryOperator<string, Rational> {
  constructor(private readonly scale: number) {}
  operation(x: Rational): string {
    return new Decimal(x.n)
      .div(x.d)
      .toDecimalPlaces(this.scale, Decimal.ROUND_HALF_UP)
      .toString();
  }
  apply(x: Result<Rational>): Result<string> {
    return applyUnary(this, x);
  }
  explain(x: Expression<Rational>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

export class AsDecimalStringFactory implements CompNodeFactory {
  readonly typeName = 'AsDecimalString';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const node = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      factual,
      factDictionary
    );
    const scale = e.options?.scale ?? 2;
    if (!(node instanceof RationalNode)) {
      throw new Error('AsDecimalString can only operate on a RationalNode');
    }
    return this.create(node, scale);
  }

  create(node: RationalNode, scale: number): StringNode {
    return new StringNode(
      new UnaryExpression(node.expr, new RationalAsDecimalString(scale))
    );
  }
}

compNodeRegistry.register(new AsDecimalStringFactory());
