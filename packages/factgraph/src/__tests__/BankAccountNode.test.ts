import { BankAccountNode } from '../compnodes/BankAccountNode';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';
import { BankAccount } from '../types/BankAccount';

describe('BankAccountNode', () => {
  const factual = new Factual(new FactDictionary());

  it('can be created with a valid bank account', () => {
    const bankAccount = new BankAccount('123456789', '987654321', 'CHECKING');
    const node = new BankAccountNode(
      Expression.literal(Result.complete(bankAccount))
    );
    expect(node.get(factual)).toEqual(Result.complete(bankAccount));
  });
});
