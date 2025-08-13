import { Expression } from '../Expression';
import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';

export class BooleanNode extends CompNode {
  constructor(public readonly expr: Expression<boolean>) {
    super();
  }

  protected fromExpression(expr: Expression<boolean>): CompNode {
    return new BooleanNode(expr);
  }
}

class BooleanNodeFactory implements CompNodeFactory {
  readonly typeName = 'Boolean';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    return new BooleanNode(Expression.literal(Result.complete(e.value)));
  }
}

compNodeRegistry.register(new BooleanNodeFactory());
