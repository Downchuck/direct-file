import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { Expression } from '../Expression';
import { Result } from '../types';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';

class TrueFactory implements CompNodeFactory {
  readonly typeName = 'True';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    return new BooleanNode(Expression.literal(Result.complete(true)));
  }
}

compNodeRegistry.register(new TrueFactory());
