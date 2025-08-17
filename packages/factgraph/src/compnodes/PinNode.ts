import { Expression } from '../expressions';
import { CompNode, CompNodeFactory, WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { Result } from '../types';

// The Pin type is just a string
export type Pin = string;

export class PinNode extends CompNode {
  constructor(public readonly expr: Expression<Pin>) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fromExpression(expr: Expression<Pin>): CompNode {
    return new PinNode(expr);
  }
}

export class PinNodeFactory implements CompNodeFactory, WritableNodeFactory {
  readonly typeName = 'Pin';

  fromDerivedConfig(
    e: { options: { value: string } },
    graph: Graph
  ): CompNode {
    return new PinNode(Expression.literal(Result.complete(e.options.value)));
  }

  fromWritableConfig(): CompNode {
    return new PinNode(Expression.writable(Result.incomplete()));
  }
}
