import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory, WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { Day } from '../types/Day';
import { PathItem } from '../PathItem';
import { IntNode } from './IntNode';
import { Factual } from '../Factual';
import { UnaryExpression } from '../expressions/UnaryExpression';
import { UnaryOperator } from '../operators/UnaryOperator';
import { ExtractExpression } from '../expressions/ExtractExpression';

export class DayNode extends CompNode<Day> {
  constructor(expression: Expression<Day>) {
    super(expression);
  }

  public override set(factual: Factual, value: Day): CompNode<Day> {
    return new DayNode(Expression.literal(value));
  }

  public override extract(key: PathItem, factual: Factual): CompNode | undefined {
    if (key.key === 'year') {
      return new IntNode(new ExtractExpression(this.expression, r => r.map(d => d.year)));
    }
    if (key.key === 'month') {
      return new IntNode(new ExtractExpression(this.expression, r => r.map(d => d.month)));
    }
    if (key.key === 'day') {
      return new IntNode(new ExtractExpression(this.expression, r => r.map(d => d.day)));
    }
    return undefined;
  }
}

export const DayNodeFactory: DerivedNodeFactory & WritableNodeFactory = {
  typeName: 'Day',
  fromWritableConfig: (e: any, graph: Graph) => new DayNode(Expression.literal(Day.fromDate(new Date()))),
  fromDerivedConfig: (e: any, graph: Graph) => new DayNode(Expression.literal(Day.fromString(e.value))),
};
