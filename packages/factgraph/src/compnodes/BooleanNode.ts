import { CompNode } from './CompNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { Result } from '../types/Result';

export class BooleanNode extends CompNode {
  constructor(public readonly expr: Expression<boolean>) {
    super();
  }

  get get() {
    return (factual: Factual): Result<boolean> => {
      return this.expr.get(factual);
    }
  }

  fromExpression(expr: Expression<any>): CompNode {
    return new BooleanNode(expr);
  }
}
