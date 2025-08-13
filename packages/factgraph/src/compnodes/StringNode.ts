import { Expression } from '../Expression';
import { CompNode, compNodeRegistry } from './CompNode';
import { Factual } from '../Factual';
import { WritableNodeFactory } from './WritableNodeFactory';
import { WritableExpression } from '../expressions/WritableExpression';
import { Result } from '../types';
import { Path } from '../Path';

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

class StringNodeFactory extends WritableNodeFactory {
  readonly typeName = 'String';

  create(path: Path, factual: Factual): CompNode {
    return new StringNode(new WritableExpression<string>(path));
  }

  fromDerivedConfig(
    e: any,
    factual: Factual,
  ): CompNode {
    const value = e.config?.value;
    if (value) {
      return new StringNode(Expression.literal(Result.complete(value)));
    }
    return super.fromDerivedConfig(e, factual);
  }
}

compNodeRegistry.register(new StringNodeFactory());
