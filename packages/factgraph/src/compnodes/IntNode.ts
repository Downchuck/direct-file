import { Expression } from '../Expression';
import { CompNode, compNodeRegistry } from './CompNode';
import { Factual } from '../Factual';
import { WritableNodeFactory } from './WritableNodeFactory';
import { WritableExpression } from '../expressions/WritableExpression';
import { Result } from '../types';
import { Path } from '../Path';

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

class IntNodeFactory extends WritableNodeFactory {
  readonly typeName = 'Int';

  create(path: Path, factual: Factual): CompNode {
    return new IntNode(new WritableExpression<number>(path));
  }

  fromDerivedConfig(
    e: any,
    factual: Factual,
  ): CompNode {
    const value = e.config?.value;
    if (value) {
      return new IntNode(Expression.literal(Result.complete(parseInt(value, 10))));
    }
    return super.fromDerivedConfig(e, factual);
  }
}

compNodeRegistry.register(new IntNodeFactory());
