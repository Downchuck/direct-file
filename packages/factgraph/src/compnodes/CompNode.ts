import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { PathItem } from '../PathItem';
import { Graph } from "../Graph";

export interface DerivedNodeFactory {
  readonly typeName: string;
  fromDerivedConfig(e: any, graph: Graph, children: CompNode[]): CompNode;
}

export interface WritableNodeFactory {
    readonly typeName: string;
    fromWritableConfig(config: any, graph: Graph): CompNode;
}

export type CompNodeFactory = DerivedNodeFactory | WritableNodeFactory;

export class CompNode<T = any> {
  constructor(public readonly expression: Expression<T>) {}

  public get(factual: Factual, ...children: Expression<any>[]): Result<T> {
    return this.expression.get(factual, ...children);
  }

  public explain(factual: Factual, ...children: Expression<any>[]): Explanation {
    return this.expression.explain(factual, ...children);
  }

  public set(factual: Factual, value: T): CompNode<T> {
    throw new Error(`Set is not implemented for ${this.constructor.name}`);
  }

  public extract(key: PathItem, factual: Factual): CompNode | undefined {
    return undefined;
  }
}
