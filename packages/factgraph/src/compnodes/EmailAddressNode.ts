import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { EmailAddress } from '../types/EmailAddress';
import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
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

const emailAddressNodeFactory: CompNodeFactory = {
  typeName: 'EmailAddress',
  fromDerivedConfig(
    e: { value?: string, writable?: boolean },
    factual: Factual,
    factDictionary: FactDictionary
  ): EmailAddressNode {
    if (e.writable) {
        return new EmailAddressNode(Expression.literal(Result.incomplete()));
    }
    if (e.value) {
      return new EmailAddressNode(Expression.literal(Result.complete(EmailAddress.fromString(e.value))));
    }
    throw new Error('EmailAddress node requires a value or to be writable.');
  },
};

compNodeRegistry.register(emailAddressNodeFactory);
