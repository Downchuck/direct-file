import { Expression } from '../Expression';
import { CompNode, DerivedNodeFactory, WritableNodeFactory } from './CompNode';
import { Graph } from '../Graph';
import { Factual } from '../Factual';
import { BankAccount } from '../types/BankAccount';

export class BankAccountNode extends CompNode<BankAccount> {
  constructor(expression: Expression<BankAccount>) {
    super(expression);
  }

  public override set(factual: Factual, value: BankAccount): CompNode<BankAccount> {
    return new BankAccountNode(Expression.literal(value));
  }
}

export const BankAccountNodeFactory: DerivedNodeFactory & WritableNodeFactory = {
  typeName: 'BankAccount',
  fromWritableConfig: (e: any, graph: Graph) => new BankAccountNode(Expression.literal(new BankAccount('', '', 'CHECKING'))),
  fromDerivedConfig: (e: any, graph: Graph, children: CompNode[]) => new BankAccountNode(Expression.literal(e.value)),
};
