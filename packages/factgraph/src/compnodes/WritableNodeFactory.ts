import { CompNode } from './CompNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';

export interface WritableNodeFactory {
  readonly typeName: string;
  fromWritableConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode;
}
