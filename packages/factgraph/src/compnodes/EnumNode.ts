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

export const EnumNodeFactory: CompNodeFactory = {
  typeName: 'Enum',
  fromDerivedConfig(
    e: { value?: string; writable?: boolean; options?: { name: string, value: string }[] },
    graph: Graph
  ): EnumNode {
    const enumOptionsPath = e.options?.find(o => o.name === 'optionsPath')?.value;
    if (!enumOptionsPath) {
      throw new Error('Enum must contain optionsPath');
    }

    if (e.writable) {
      return new EnumNode(Expression.literal(Result.incomplete()), enumOptionsPath);
    }

    if (e.value) {
      return new EnumNode(
        Expression.literal(
          Result.complete(Enum.fromString(e.value, enumOptionsPath))
        ),
        enumOptionsPath
      );
    }

    throw new Error('Enum node requires a value or to be writable.');
  },
};
