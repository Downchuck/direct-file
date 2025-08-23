import { CompNode, DerivedNodeFactory } from './CompNode';
import { Day } from '../types/Day';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { TodayExpression } from '../expressions/TodayExpression';

export class TodayNode extends CompNode<Day> {
  constructor() {
    super(new TodayExpression());
  }
}

export const TodayNodeFactory: DerivedNodeFactory = {
  typeName: 'Today',
  fromDerivedConfig(e: any, graph: Graph, children: CompNode[]): CompNode {
    return new TodayNode();
  },
};
