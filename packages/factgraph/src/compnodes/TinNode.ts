import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Tin } from '../types/Tin';
import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { Result } from '../types';
import { BooleanNode } from './BooleanNode';
import { PathItem } from '../PathItem';

export class TinNode extends CompNode {
  constructor(
    readonly expr: Expression<Tin>,
    private readonly allowAllZeros: boolean
  ) {
    super();
  }

  protected fromExpression(expr: Expression<Tin>): TinNode {
    return new TinNode(expr, this.allowAllZeros);
  }

  get valueClass() {
    return Tin;
  }

  override extract(key: PathItem): CompNode | undefined {
    if (key.key === 'isSSN') {
      return new BooleanNode(this.expr.map(r => r.map(t => t.isSSN())));
    }
    if (key.key === 'isITIN') {
      return new BooleanNode(this.expr.map(r => r.map(t => t.isITIN())));
    }
    if (key.key === 'isATIN') {
      return new BooleanNode(this.expr.map(r => r.map(t => t.isATIN())));
    }
    return undefined;
  }
}

const tinNodeFactory: CompNodeFactory = {
  typeName: 'TIN',
  fromDerivedConfig(
    e: { value?: string; writable?: boolean; options?: { name: string, value: string }[] },
    factual: Factual,
    factDictionary: FactDictionary
  ): TinNode {
    const allowAllZeros = e.options?.find(o => o.name === 'ALLOW_ALL_ZEROS')?.value === 'true';

    if (e.writable) {
      return new TinNode(Expression.literal(Result.incomplete()), allowAllZeros);
    }
    if (e.value) {
      return new TinNode(
        Expression.literal(
          Result.complete(Tin.fromString(e.value, allowAllZeros))
        ),
        allowAllZeros
      );
    }
    throw new Error('TIN node requires a value or to be writable.');
  },
};

compNodeRegistry.register(tinNodeFactory);
