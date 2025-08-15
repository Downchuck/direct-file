import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory, WritableNodeFactory, compNodeRegistry } from './CompNode';
import { Graph } from '../Graph';
import { Days } from '../types/Days';
import { Result } from '../types/Result';

export class DaysNode extends CompNode {
  public readonly expr: Expression<Days>;

  constructor(expr: Expression<Days>) {
    super();
    this.expr = expr;
  }

  protected fromExpression(expr: Expression<Days>): CompNode {
    return new DaysNode(expr);
  }
}

class DaysNodeFactory implements DerivedNodeFactory, WritableNodeFactory {
  readonly typeName = 'Days';

  fromWritableConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    return new DaysNode(Expression.writable(Result.incomplete()));
  }

  fromDerivedConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    // TODO: getOptionValue
    const value = e.value || '0';
    return new DaysNode(
      Expression.literal(Result.complete(new Days(parseInt(value, 10))))
    );
  }
}

compNodeRegistry.register(new DaysNodeFactory());
