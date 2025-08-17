import { CompNode, CompNodeFactory } from './CompNode';
import { Expression } from '../expressions';
import { Graph } from '../Graph';
import { UnaryOperator } from '../operators';
import { EnumOptionsNode } from './EnumOptionsNode';
import { IntNode } from './IntNode';
import { compNodeRegistry } from './registry';

class EnumOptionsSizeOperator implements UnaryOperator<string[], number> {
  apply(value: string[]): number {
    return value.length;
  }
}

const operator = new EnumOptionsSizeOperator();

export class EnumOptionsSizeFactory implements CompNodeFactory {
  readonly typeName = 'EnumOptionsSize';

  fromDerivedConfig(
    e: { children: any[] },
    graph: Graph
  ): CompNode {
    const child = compNodeRegistry.fromDerivedConfig(
      e.children[0],
      graph
    ) as EnumOptionsNode;
    return new IntNode(new Expression.Unary(child.expr, operator));
  }
}
