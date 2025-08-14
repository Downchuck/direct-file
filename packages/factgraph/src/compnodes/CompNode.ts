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
    console.log('registering', factory.typeName);
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
