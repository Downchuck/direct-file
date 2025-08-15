import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory, WritableNodeFactory, compNodeRegistry } from './CompNode';
import { Graph } from '../Graph';
import { Result } from '../types/Result';

export class IntNode extends CompNode {
  public readonly expr: Expression<number>;

  constructor(expr: Expression<number>) {
    super();
    this.expr = expr;
  }

  protected fromExpression(expr: Expression<number>): CompNode {
    return new IntNode(expr);
  }
}

class IntNodeFactory implements DerivedNodeFactory, WritableNodeFactory {
  readonly typeName = 'Int';

  fromWritableConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    return new IntNode(Expression.writable(Result.incomplete()));
  }

  fromDerivedConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    // TODO: getOptionValue
    const value = parseInt(e.value, 10);
    return new IntNode(Expression.literal(Result.complete(value)));
  }
}

compNodeRegistry.register(new IntNodeFactory());
