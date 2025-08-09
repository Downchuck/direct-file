import { BankAccount, BankAccountType, parseBankAccount } from './BankAccount';

export const BankAccountFactory = (
  accountType: BankAccountType,
  routingNumber: string,
  accountNumber: string,
): { right: BankAccount } => {
  return {
    right: parseBankAccount({
      accountType,
      routingNumber,
      accountNumber,
    }),
  };
};
