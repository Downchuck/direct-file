import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { DependencyExpression } from '../expressions/DependencyExpression';
import { Path } from '../Path';

export class DependencyNode extends CompNode {
  public readonly expr: Expression<any>;

  constructor(expr: Expression<any>) {
    super();
    this.expr = expr;
  }

  protected fromExpression(expr: Expression<any>): CompNode {
    return new DependencyNode(expr);
  }
}

export const DependencyFactory: DerivedNodeFactory = {
  typeName: 'Dependency',

  fromDerivedConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    const path = Path.fromString(e.options.path);
    return new DependencyNode(new DependencyExpression(path));
  },
};
