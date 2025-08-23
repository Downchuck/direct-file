import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory, WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { Address } from '../types/Address';
import { Result } from '../types';
import { PathItem } from '../PathItem';
import { StringNode } from './StringNode';
import { BooleanNode } from './BooleanNode';
import { Factual } from '../Factual';
import { ExtractExpression } from '../expressions/ExtractExpression';

export class AddressNode extends CompNode<Address> {
  constructor(expression: Expression<Address>) {
    super(expression);
  }

  public override set(factual: Factual, value: Address): CompNode<Address> {
    return new AddressNode(Expression.literal(value));
  }

  override extract(key: PathItem, factual: Factual): CompNode | undefined {
    if (key.key === 'streetAddress') {
      return new StringNode(new ExtractExpression(this.expression, r => r.map(a => a.streetAddress)));
    }
    if (key.key === 'city') {
        return new StringNode(new ExtractExpression(this.expression, r => r.map(a => a.city)));
    }
    if (key.key === 'postalCode') {
        return new StringNode(new ExtractExpression(this.expression, r => r.map(a => a.postalCode)));
    }
    if (key.key === 'stateOrProvence') {
        return new StringNode(new ExtractExpression(this.expression, r => r.map(a => a.stateOrProvence)));
    }
    if (key.key === 'streetAddressLine2') {
        return new StringNode(new ExtractExpression(this.expression, r => r.map(a => a.streetAddressLine2)));
    }
    if (key.key === 'country') {
        return new StringNode(new ExtractExpression(this.expression, r => r.map(a => a.country)));
    }
    if (key.key === 'foreignAddress') {
        return new BooleanNode(new ExtractExpression(this.expression, r => r.map(a => a.isForeignAddress())));
    }
    return undefined;
  }
}

export const AddressNodeFactory: DerivedNodeFactory & WritableNodeFactory = {
  typeName: 'Address',

  fromWritableConfig(e: any, graph: Graph): CompNode {
    return new AddressNode(Expression.literal(new Address('', '', '', '', '', '')));
  },

  fromDerivedConfig(e: any, graph: Graph, children: CompNode[]): CompNode {
    const value = e.value || '';
    const address = Address.fromString(value);
    if (address) {
      return new AddressNode(Expression.literal(address));
    }
    return new AddressNode(Expression.literal(new Address('', '', '', '', '', '')));
  },
};
