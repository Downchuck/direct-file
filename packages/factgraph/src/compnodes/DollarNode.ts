import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory, WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { Dollar } from '../types/Dollar';
import { Result } from '../types/Result';

export class DollarNode extends CompNode {
  public readonly expr: Expression<Dollar>;

  constructor(expr: Expression<Dollar>) {
    super();
    this.expr = expr;
  }

  protected fromExpression(expr: Expression<Dollar>): CompNode {
    return new DollarNode(expr);
  }
}

export class DollarNodeFactory implements DerivedNodeFactory, WritableNodeFactory {
  readonly typeName = 'Dollar';

  fromWritableConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    return new DollarNode(Expression.writable(Result.incomplete()));
  }

  fromDerivedConfig(
    e: { options: { value: number } },
    graph: Graph,
  ): CompNode {
    return new DollarNode(
      Expression.literal(Result.complete(Dollar.fromNumber(e.options.value)))
    );
  }
}
