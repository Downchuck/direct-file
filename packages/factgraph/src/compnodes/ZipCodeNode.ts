import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory, WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { Factual } from '../Factual';

export class ZipCodeNode extends CompNode<string> {
  constructor(expression: Expression<string>) {
    super(expression);
  }

  public override set(factual: Factual, value: string): CompNode<string> {
    // TODO: Add validation for zip code format
    return new ZipCodeNode(Expression.literal(value));
  }
}

export const ZipCodeNodeFactory: DerivedNodeFactory & WritableNodeFactory = {
  typeName: 'ZipCode',
  fromWritableConfig: (e: any, graph: Graph) => new ZipCodeNode(Expression.literal('')),
  fromDerivedConfig: (e: any, graph: Graph) => new ZipCodeNode(Expression.literal(e.value ?? '')),
};
