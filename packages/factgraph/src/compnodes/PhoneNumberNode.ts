import { Expression } from '../Expression';
import { CompNode, WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { Result } from '../types';

export class PhoneNumberNode extends CompNode {
  constructor(public readonly expr: Expression<string>) {
    super();
  }

  protected fromExpression(expr: Expression<string>): CompNode {
    return new PhoneNumberNode(expr);
  }
}

export const PhoneNumberNodeFactory: WritableNodeFactory = {
  typeName: 'PhoneNumber',

  fromWritableConfig(e: any, graph: Graph): CompNode {
    return new PhoneNumberNode(Expression.writable(Result.incomplete()));
  },
};
