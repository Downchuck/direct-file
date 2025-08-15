import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory, WritableNodeFactory, compNodeRegistry } from './CompNode';
import { Graph } from '../Graph';
import { Address } from '../types/Address';
import { Result } from '../types';
import { PathItem } from '../PathItem';
import { StringNode } from './StringNode';
import { BooleanNode } from './BooleanNode';

export class AddressNode extends CompNode {
  public readonly expr: Expression<Address>;

  constructor(expr: Expression<Address>) {
    super();
    this.expr = expr;
  }

  protected fromExpression(expr: Expression<Address>): CompNode {
    return new AddressNode(expr);
  }

  override extract(key: PathItem): CompNode | undefined {
    if (key.type === 'child' && key.key === 'streetAddress') {
      return new StringNode(
        this.expr.map((a: Result<Address>) =>
          a.map((addr) => addr.streetAddress)
        )
      );
    }
    if (key.type === 'child' && key.key === 'city') {
      return new StringNode(
        this.expr.map((a: Result<Address>) => a.map((addr) => addr.city))
      );
    }
    if (key.type === 'child' && key.key === 'postalCode') {
      return new StringNode(
        this.expr.map((a: Result<Address>) => a.map((addr) => addr.postalCode))
      );
    }
    if (key.type === 'child' && key.key === 'stateOrProvence') {
      return new StringNode(
        this.expr.map((a: Result<Address>) =>
          a.map((addr) => addr.stateOrProvence)
        )
      );
    }
    if (key.type === 'child' && key.key === 'streetAddressLine2') {
      return new StringNode(
        this.expr.map((a: Result<Address>) =>
          a.map((addr) => addr.streetAddressLine2)
        )
      );
    }
    if (key.type === 'child' && key.key === 'country') {
      return new StringNode(
        this.expr.map((a: Result<Address>) => a.map((addr) => addr.country))
      );
    }
    if (key.type === 'child' && key.key === 'foreignAddress') {
      return new BooleanNode(
        this.expr.map((a: Result<Address>) =>
          a.map((addr) => addr.isForeignAddress())
        )
      );
    }
    return undefined;
  }
}

class AddressNodeFactory implements DerivedNodeFactory, WritableNodeFactory {
  readonly typeName = 'Address';

  fromWritableConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    return new AddressNode(Expression.writable(Result.incomplete()));
  }

  fromDerivedConfig(
    e: any,
    graph: Graph,
  ): CompNode {
    const value = e.value || '';
    const address = Address.fromString(value);
    if (address) {
      return new AddressNode(Expression.literal(Result.complete(address)));
    }
    return new AddressNode(Expression.literal(Result.incomplete()));
  }
}

compNodeRegistry.register(new AddressNodeFactory());
