import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { Expression } from '../Expression';
import { Result } from '../types';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';

class FalseFactory implements CompNodeFactory {
  readonly typeName = 'False';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    return new BooleanNode(Expression.literal(Result.complete(false)));
  }
}

compNodeRegistry.register(new FalseFactory());
