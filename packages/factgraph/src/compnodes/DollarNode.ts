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

export const DollarNodeFactory: DerivedNodeFactory & WritableNodeFactory = {
  typeName: 'Dollar',

  fromWritableConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    return new DollarNode(Expression.writable(Result.incomplete()));
  },

  fromDerivedConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    // TODO: getOptionValue
    const value = e.value || '0';
    return new DollarNode(
      Expression.literal(Result.complete(Dollar.fromString(value)))
    );
  },
};
