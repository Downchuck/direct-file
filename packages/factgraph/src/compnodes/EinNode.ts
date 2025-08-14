import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Ein } from '../types/Ein';
import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { Result } from '../types';

export class EinNode extends CompNode {
  constructor(readonly expr: Expression<Ein>) {
    super();
  }

  protected fromExpression(expr: Expression<Ein>): EinNode {
    return new EinNode(expr);
  }

  get valueClass() {
      return Ein;
  }
}

const einNodeFactory: CompNodeFactory = {
  typeName: 'EIN',
  fromDerivedConfig(
    e: { value?: string, writable?: boolean },
    factual: Factual,
    factDictionary: FactDictionary
  ): EinNode {
    if (e.writable) {
        return new EinNode(Expression.literal(Result.incomplete()));
    }
    if (e.value) {
      return new EinNode(Expression.literal(Result.complete(Ein.fromString(e.value))));
    }
    throw new Error('EIN node requires a value or to be writable.');
  },
};

compNodeRegistry.register(einNodeFactory);
