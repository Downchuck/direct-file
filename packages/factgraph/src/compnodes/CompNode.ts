import { Expression } from '../Expression';
import { Path } from '../Path';
import { PathItem } from '../PathItem';
import type { Factual } from '../Factual';
import { Limit } from '../limits/Limit';
import { Graph } from "../Graph";

export interface DerivedNodeFactory {
  readonly typeName: string;
  fromDerivedConfig(
    e: any,
    graph: Graph,
  ): CompNode;
}

export interface WritableNodeFactory {
    readonly typeName: string;
    fromWritableConfig(
      e: any,
      graph: Graph,
    ): CompNode;
}

export type CompNodeFactory = DerivedNodeFactory | WritableNodeFactory;

export abstract class CompNode {
  abstract readonly expr: Expression<any>;

  public get(factual: Factual) {
    return this.expr.get(factual);
  }
  public getThunk(factual: Factual) {
    return this.expr.getThunk(factual);
  }
  public explain(factual: Factual) {
    return this.expr.explain(factual);
  }
  public set(value: any, allowCollectionItemDelete: boolean = false) {
    return this.expr.set(value, allowCollectionItemDelete);
  }
  public delete() {
    return this.expr.delete();
  }
  public isWritable(): boolean {
    return this.expr.isWritable;
  }

  protected abstract fromExpression(expr: Expression<any>): CompNode;

  public switch(cases: [CompNode, CompNode][]): CompNode {
    // TODO: Add type checking
    const newCases = cases.map(
      ([booleanNode, compNode]) =>
        [booleanNode.expr, compNode.expr] as [
          Expression<boolean>,
          Expression<any>
        ]
    );
    return this.fromExpression(Expression.switch(newCases));
  }

  public dependency(path: Path): CompNode {
    // return this.fromExpression(Expression.dependency(path));
    throw new Error('Not implemented');
  }

  public extract(key: PathItem, factual: Factual): CompNode | undefined {
    return undefined;
  }

  public getIntrinsicLimits(factual: Factual): Limit[] {
    return [];
  }
}
