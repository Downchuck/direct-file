import { CompNode, WritableNodeFactory } from "./CompNode";
import { Expression } from "../Expression";
import { BankAccount } from "../types/BankAccount";
import { Graph } from "../Graph";
import { Result } from "../types";

export class BankAccountNode extends CompNode {
  constructor(public readonly expr: Expression<BankAccount>) {
    super();
  }

  protected fromExpression(expr: Expression<BankAccount>): CompNode {
    return new BankAccountNode(expr);
  }
}

export const BankAccountNodeFactory: WritableNodeFactory = {
  typeName: "BankAccount",

  fromWritableConfig(e: any, graph: Graph): CompNode {
    return new BankAccountNode(Expression.writable(Result.incomplete()));
  },
};
