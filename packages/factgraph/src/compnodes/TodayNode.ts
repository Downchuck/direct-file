import { CompNode, CompNodeFactory } from './CompNode';
import { DayNode } from './DayNode';
import { Expression } from '../Expression';
import { Result } from '../types';
import { Graph } from '../Graph';
import { Day } from '../types/Day';

export const TodayNodeFactory: CompNodeFactory = {
  typeName: 'Today',

  fromDerivedConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    return new DayNode(Expression.literal(Result.complete(new Day())));
  },
};
