import { CompNode, DerivedNodeFactory } from './CompNode';
import { DayNode } from './DayNode';
import { IntNode } from './IntNode';
import { getChildNode } from '../util/getChildNode';
import { Graph } from '../Graph';
import { TodayExpression } from '../expressions/TodayExpression';

export const TodayNodeFactory: DerivedNodeFactory = {
  typeName: 'Today',

  fromDerivedConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    const offsetNode = getChildNode(e.children[0], graph);

    if (!(offsetNode instanceof IntNode)) {
      throw new Error('TodayNode input must be an IntNode');
    }

    return new DayNode(new TodayExpression(offsetNode.expr));
  },
};
