import { Expression } from '../Expression';
import { Graph } from '../Graph';
import { Enum } from '../types/Enum';
import { CompNode, CompNodeFactory } from './CompNode';
import { Result } from '../types';

export class EnumNode extends CompNode {
  constructor(
    readonly expr: Expression<Enum>,
    public readonly enumOptionsPath: string
  ) {
    super();
  }

  protected fromExpression(expr: Expression<Enum>): EnumNode {
    return new EnumNode(expr, this.enumOptionsPath);
  }

  get valueClass() {
    return Enum;
  }
}

export class EnumNodeFactory implements CompNodeFactory {
  readonly typeName = 'Enum';
  fromDerivedConfig(
    e: { options: { value: string, enum: string[] } },
    graph: Graph
  ): EnumNode {
    const { value, enum: enumOptions } = e.options;
    return new EnumNode(
      Expression.literal(
        Result.complete(Enum.fromString(value, enumOptions))
      ),
      '' // enumOptionsPath is not used
    );
  }
};
