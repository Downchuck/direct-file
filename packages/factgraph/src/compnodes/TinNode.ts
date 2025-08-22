import { Expression } from '../Expression';
import { Graph } from '../Graph';
import { Tin } from '../types/Tin';
import { CompNode, DerivedNodeFactory, WritableNodeFactory } from './CompNode';
import { Result } from '../types';
import { BooleanNode } from './BooleanNode';
import { PathItem } from '../PathItem';
import { Factual } from '../Factual';
import { ExtractExpression } from '../expressions/ExtractExpression';

export class TinNode extends CompNode<Tin> {
  constructor(
    expression: Expression<Tin>,
    private readonly allowAllZeros: boolean
  ) {
    super(expression);
  }

  public override set(factual: Factual, value: Tin): CompNode<Tin> {
    // This doesn't seem right. The new node should preserve the allowAllZeros setting.
    return new TinNode(Expression.literal(value), this.allowAllZeros);
  }

  override extract(key: PathItem, factual: Factual): CompNode | undefined {
    if (key.key === 'isSSN') {
      return new BooleanNode(new ExtractExpression(this.expression, r => r.map(t => t.isSSN)));
    }
    if (key.key === 'isITIN') {
      return new BooleanNode(new ExtractExpression(this.expression, r => r.map(t => t.isITIN)));
    }
    if (key.key === 'isATIN') {
      return new BooleanNode(new ExtractExpression(this.expression, r => r.map(t => t.isATIN)));
    }
    return undefined;
  }
}

export const TinNodeFactory: DerivedNodeFactory & WritableNodeFactory = {
  typeName: 'TIN',
  fromWritableConfig(e: any, graph: Graph): CompNode {
    const allowAllZeros = e.options?.find((o:any) => o.name === 'ALLOW_ALL_ZEROS')?.value === 'true';
    return new TinNode(Expression.literal(Tin.fromString('', allowAllZeros)), allowAllZeros);
  },
  fromDerivedConfig(e: any, graph: Graph, children: CompNode[]): CompNode {
    const allowAllZeros = e.options?.find((o:any) => o.name === 'ALLOW_ALL_ZEROS')?.value === 'true';
    return new TinNode(Expression.literal(Tin.fromString(e.value ?? '', allowAllZeros)), allowAllZeros);
  },
};
