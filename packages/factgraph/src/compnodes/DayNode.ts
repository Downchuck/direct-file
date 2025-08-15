import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory, WritableNodeFactory, compNodeRegistry } from './CompNode';
import { Graph } from '../Graph';
import { Day } from '../types/Day';
import { PathItem } from '../PathItem';
import { IntNode } from './IntNode';
import { Result } from '../types/Result';
import { ExtractExpression } from '../expressions/ExtractExpression';

export class DayNode extends CompNode {
  public readonly expr: Expression<Day>;

  constructor(expr: Expression<Day>) {
    super();
    this.expr = expr;
  }

  protected fromExpression(expr: Expression<Day>): CompNode {
    return new DayNode(expr);
  }

  public extract(key: PathItem): CompNode | undefined {
    if (!key.isParent && !key.isWildcard && !key.isUnknown) {
      switch (key.value) {
        case 'year':
          return new IntNode(
            new ExtractExpression(this.expr, (r) => r.map((d) => d.year))
          );
        case 'month':
          return new IntNode(
            new ExtractExpression(this.expr, (r) => r.map((d) => d.month))
          );
        case 'day':
          return new IntNode(
            new ExtractExpression(this.expr, (r) => r.map((d) => d.day))
          );
      }
    }
    return undefined;
  }
}

class DayNodeFactory implements DerivedNodeFactory, WritableNodeFactory {
  readonly typeName = 'Day';

  fromWritableConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    return new DayNode(Expression.writable(Result.incomplete()));
  }

  fromDerivedConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    // TODO: getOptionValue
    const value = e.value || '2000-01-01';
    return new DayNode(Expression.literal(Result.complete(new Day(value))));
  }
}

compNodeRegistry.register(new DayNodeFactory());
