import { CompNode, DerivedNodeFactory } from './CompNode';
import { Expression } from '../Expression';
import { Graph } from '../Graph';
import { PathItem } from '../PathItem';
import { Factual } from '../Factual';

export class RootNode extends CompNode<null> {
  constructor() {
    super(Expression.literal(null));
  }

  public override extract(key: PathItem, factual: Factual): CompNode | undefined {
    const fact = factual.getFact(key.toString());
    return fact?.value;
  }
}

export const RootNodeFactory: DerivedNodeFactory = {
  typeName: 'Root',
  fromDerivedConfig(e: any, graph: Graph, children: CompNode[]): CompNode {
    return new RootNode();
  },
};
