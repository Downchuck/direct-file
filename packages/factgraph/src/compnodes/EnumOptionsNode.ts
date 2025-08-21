import { Expression } from '../expressions';
import { CompNode, CompNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { StringNode } from './StringNode';
import { BooleanNode } from './BooleanNode';
import { compNodeRegistry } from './registry';

export class EnumOptionsNode extends CompNode {
  constructor(public readonly expr: Expression<string[]>) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fromExpression(expr: Expression<string[]>): CompNode {
    return new EnumOptionsNode(expr);
  }
}

export const EnumOptionsNodeFactory: CompNodeFactory = {
  typeName: 'EnumOptions',

  fromDerivedConfig(
    e: { children: any[] },
    graph: Graph
  ): CompNode {
    const options = e.children.map(c => {
      const value = c.options.value;
      if (typeof value !== 'string') {
        throw new Error('EnumOption value must be a string');
      }
      const condition = c.children.length
        ? (compNodeRegistry.fromDerivedConfig(
            c.children[0],
            graph
          ) as BooleanNode)
        : new BooleanNode(Expression.literal({ value: true, isComplete: true }));

      const valueNode = new StringNode(
        Expression.literal({ value, isComplete: true })
      );
      return [condition.expr, valueNode.expr];
    });

    const expr = Expression.conditionalList(options);
    return new EnumOptionsNode(expr);
  },
};
