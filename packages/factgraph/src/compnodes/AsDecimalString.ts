import { UnaryExpression } from '../expressions/UnaryExpression';
import { UnaryOperator } from '../operators/UnaryOperator';
import {
  applyUnary,
  explainUnary,
} from '../operators/UnaryOperatorHelpers';
import { Factual } from '../Factual';
import { Rational } from '../types/Rational';
import { Result } from '../types/Result';
import { CompNode, CompNodeFactory } from './CompNode';
import { StringNode } from './StringNode';
import { Graph } from '../Graph';
import { Explanation } from '../Explanation';
import { Expression } from '../Expression';
import { compNodeRegistry } from './registry';

class RationalAsDecimalString
  implements UnaryOperator<string, Rational>
{
  constructor(private readonly scale: number) {}
  operation(x: Rational): string {
    return x.toDecimal(this.scale);
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
  fromDerivedConfig(e: any, graph: Graph): CompNode {
    const child = compNodeRegistry.fromDerivedConfig(e.children[0], graph);
    const scale = e.options?.scale ?? 2;
    return new StringNode(
      new UnaryExpression(
        child.expr as Expression<Rational>,
        new RationalAsDecimalString(scale)
      )
    );
  }
}
