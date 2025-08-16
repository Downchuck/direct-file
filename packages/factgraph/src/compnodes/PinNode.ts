import { Expression } from '../expressions';
import { CompNode, CompNodeFactory, compNodeRegistry, WritableNodeFactory } from './CompNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';

// The Pin type is just a string
export type Pin = string;

export class PinNode extends CompNode<Pin> {
  constructor(expr: Expression<Pin>) {
    super(expr);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fromExpression(expr: Expression<Pin>): CompNode<Pin> {
    return new PinNode(expr);
  }
}

class PinNodeFactory implements CompNodeFactory, WritableNodeFactory {
  readonly typeName = 'Pin';

  fromDerivedConfig(
    e: { options: { value: string } },
    factual: Factual,
    dictionary: FactDictionary
  ): CompNode<any> {
    return new PinNode(Expression.literal(e.options.value));
  }

  fromWritableConfig(): CompNode<any> {
    return new PinNode(new Expression.Writable());
  }
}

compNodeRegistry.register(new PinNodeFactory());
