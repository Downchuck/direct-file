import { Expression } from '../Expression';
import { Path } from '../Path';
import { PathItem } from '../PathItem';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Limit } from '../limits/Limit';

export interface CompNodeFactory {
  readonly typeName: string;
  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode;
}

export abstract class CompNode {
  abstract readonly expr: Expression<any>;

  public get get() {
    return this.expr.get;
  }
  public get getThunk() {
    return this.expr.getThunk;
  }
  public get explain() {
    return this.expr.explain;
  }
  public get set() {
    return this.expr.set;
  }
  public get delete() {
    return this.expr.delete;
  }
  public get isWritable() {
    return this.expr.isWritable;
  }

  protected abstract fromExpression(expr: Expression<any>): CompNode;

  public switch(cases: [CompNode, CompNode][]): CompNode {
    // TODO: Add type checking
    const newCases = cases.map(
      ([booleanNode, compNode]) =>
        [booleanNode.expr, compNode.expr] as [Expression<any>, Expression<any>]
    );
    // return this.fromExpression(Expression.switch(newCases));
    throw new Error('Not implemented');
  }

  public dependency(path: Path): CompNode {
    // return this.fromExpression(Expression.dependency(path));
    throw new Error('Not implemented');
  }

  public extract(key: PathItem): CompNode | undefined {
    return undefined;
  }

  public getIntrinsicLimits(factual: Factual): Limit[] {
    return [];
  }
}

class CompNodeRegistry {
  private factories = new Map<string, CompNodeFactory>();

  public register(factory: CompNodeFactory) {
    this.factories.set(factory.typeName, factory);
  }

  public fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const factory = this.factories.get(e.typeName);
    if (!factory) {
      throw new Error(`${e.typeName} is not a registered CompNode`);
    }
    return factory.fromDerivedConfig(e, factual, factDictionary);
  }
}

export const compNodeRegistry = new CompNodeRegistry();
