import { EmailAddress } from '../types/EmailAddress';
import { EmailAddressNode } from '../compnodes/EmailAddressNode';
import { Expression } from '../Expression';
import { Result } from '../types';

// This is a workaround for the fact that EmailAddressNode is not exported from index.ts yet
import '../compnodes/EmailAddressNode';

describe('EmailAddressNode', () => {
  it('should be creatable with a constant value', () => {
    const email = EmailAddress.fromString('test@example.com');
    const emailAddressNode = new EmailAddressNode(Expression.literal(Result.complete(email)));
    expect(emailAddressNode).toBeDefined();
  });

  it('should be creatable as a writable node', () => {
    const emailAddressNode = new EmailAddressNode(Expression.literal(Result.incomplete()));
    expect(emailAddressNode).toBeDefined();
  });
});
