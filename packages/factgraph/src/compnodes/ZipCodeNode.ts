import { Expression } from '../Expression';
import { CompNode, WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { Result } from '../types';

export class ZipCodeNode extends CompNode {
  constructor(public readonly expr: Expression<string>) {
    super();
  }

  protected fromExpression(expr: Expression<string>): CompNode {
    return new ZipCodeNode(expr);
  }
}

export const ZipCodeNodeFactory: WritableNodeFactory = {
  typeName: 'ZipCode',

  fromWritableConfig(e: any, graph: Graph): CompNode {
    return new ZipCodeNode(Expression.writable(Result.incomplete()));
  },
};
