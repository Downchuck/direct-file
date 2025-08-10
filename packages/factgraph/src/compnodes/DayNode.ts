import { Expression } from '../Expression';
import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { WritableNodeFactory } from './WritableNodeFactory';
import { Day } from '../types/Day';
import { PathItem } from '../PathItem';
import { IntNode } from './IntNode';
import { Result } from '../types';

export class DayNode extends CompNode {
  public readonly expr: Expression<Day>;

  constructor(expr: Expression<Day>) {
    super();
    this.expr = expr;
  }

  protected fromExpression(expr: Expression<Day>): CompNode {
    return new DayNode(expr);
  }

  public extract(key: PathItem): CompNode | undefined {
    if (key.isChild) {
      switch (key.name) {
        case 'year':
          return new IntNode(
            new Expression<number>() /* TODO: new ExtractExpression((r: Result<Day>) => r.map(d => d.year)) */
          );
        case 'month':
          return new IntNode(
            new Expression<number>() /* TODO: new ExtractExpression((r: Result<Day>) => r.map(d => d.month)) */
          );
        case 'day':
          return new IntNode(
            new Expression<number>() /* TODO: new ExtractExpression((r: Result<Day>) => r.map(d => d.day)) */
          );
      }
    }
    return undefined;
  }
}

class DayNodeFactory implements WritableNodeFactory, CompNodeFactory {
  readonly typeName = 'Day';

  fromWritableConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    return new DayNode(new Expression<Day>());
  }

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    // TODO: getOptionValue
    const value = e.getOptionValue('value') || '2000-01-01';
    return new DayNode(new Expression<Day>());
  }
}

compNodeRegistry.register(new DayNodeFactory());
