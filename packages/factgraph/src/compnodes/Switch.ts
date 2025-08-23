import { CompNode, DerivedNodeFactory } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { Graph } from '../Graph';
import { SwitchExpression } from '../expressions/Expression';
import { Expression } from '../Expression';

export const SwitchFactory: DerivedNodeFactory = {
  typeName: 'Switch',
  fromDerivedConfig(e: any, graph: Graph, children: CompNode[]): CompNode {
    if (children.length === 0 || children.length % 2 !== 0) {
      throw new Error('Switch requires an even number of children (when/then pairs)');
    }

    const cases: [Expression<boolean>, Expression<any>][] = [];
    for (let i = 0; i < children.length; i += 2) {
      const whenNode = children[i];
      const thenNode = children[i + 1];
      if (!(whenNode instanceof BooleanNode)) {
        throw new Error('Switch "when" case must be a BooleanNode');
      }
      cases.push([whenNode.expression, thenNode.expression]);
    }

    // The type of the returned node should be the same as the first "then" node.
    const ReturnNodeType = children[1].constructor;
    // @ts-ignore
    return new ReturnNodeType(new SwitchExpression(cases));
  },
};
