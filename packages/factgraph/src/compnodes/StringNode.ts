import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory, WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { Result } from '../types';

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

export class StringNodeFactory implements DerivedNodeFactory, WritableNodeFactory {
  readonly typeName = 'String';

  fromWritableConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    return new StringNode(Expression.writable(Result.incomplete()));
  }

  fromDerivedConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    const value = e.value || '';
    return new StringNode(Expression.literal(Result.complete(value)));
  }
}
