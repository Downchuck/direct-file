import { Expression } from '../Expression';
import { Graph } from '../Graph';
import { EmailAddress } from '../types/EmailAddress';
import { CompNode, CompNodeFactory } from './CompNode';
import { Result } from '../types';

export class EmailAddressNode extends CompNode {
  constructor(readonly expr: Expression<EmailAddress>) {
    super();
  }

  protected fromExpression(expr: Expression<EmailAddress>): EmailAddressNode {
    return new EmailAddressNode(expr);
  }

  get valueClass() {
      return EmailAddress;
  }
}

export class EmailAddressNodeFactory implements CompNodeFactory {
  readonly typeName = 'EmailAddress';
  fromDerivedConfig(
    e: { value?: string, writable?: boolean },
    graph: Graph
  ): EmailAddressNode {
    if (e.writable) {
        return new EmailAddressNode(Expression.literal(Result.incomplete()));
    }
    if (e.value) {
      return new EmailAddressNode(Expression.literal(Result.complete(EmailAddress.fromString(e.value))));
    }
    throw new Error('EmailAddress node requires a value or to be writable.');
  }
};
