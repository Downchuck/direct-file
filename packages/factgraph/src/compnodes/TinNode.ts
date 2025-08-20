import { Expression } from '../Expression';
import { Graph } from '../Graph';
import { Tin } from '../types/Tin';
import { CompNode, CompNodeFactory } from './CompNode';
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

export class TinNodeFactory implements CompNodeFactory {
  readonly typeName = 'TIN';
  fromDerivedConfig(
    e: { options: { value: string, allowAllZeros?: boolean } },
    graph: Graph
  ): TinNode {
    const { value, allowAllZeros = false } = e.options;
    return new TinNode(
      Expression.literal(
        Result.complete(Tin.fromString(value, allowAllZeros))
      ),
      allowAllZeros
    );
  }
}
