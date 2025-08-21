import { CompNode, CompNodeFactory } from './CompNode';
import { StringNode } from './StringNode';
import { EnumNode } from './EnumNode';
import { EmailAddressNode } from './EmailAddressNode';
import { DollarNode } from './DollarNode';
import { EinNode } from './EinNode';
import { TinNode } from './TinNode';
import { UnaryOperator } from '../operators/UnaryOperator';
import {
  applyUnary,
  explainUnary,
} from '../operators/UnaryOperatorHelpers';
import { Expression } from '../Expression';
import { Factual } from '../Factual';
import { Graph } from '../Graph';
import { Result } from '../types';
import { Explanation } from '../Explanation';
import { Enum, EmailAddress, Dollar, Ein, Tin } from '../types';
import { UnaryExpression } from '../expressions/UnaryExpression';
import { compNodeRegistry } from './registry';

class EnumAsStringOperator implements UnaryOperator<string, Enum> {
  operation(x: Enum): string {
    return x.getValue();
  }
  apply(x: Result<Enum>): Result<string> {
    return applyUnary(this, x);
  }
  explain(x: Expression<Enum>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

class EmailAsStringOperator implements UnaryOperator<string, EmailAddress> {
  operation(x: EmailAddress): string {
    return x.toString();
  }
  apply(x: Result<EmailAddress>): Result<string> {
    return applyUnary(this, x);
  }
  explain(x: Expression<EmailAddress>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

class DollarAsStringOperator implements UnaryOperator<string, Dollar> {
  operation(x: Dollar): string {
    return x.toString();
  }
  apply(x: Result<Dollar>): Result<string> {
    return applyUnary(this, x);
  }
  explain(x: Expression<Dollar>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

class EinAsStringOperator implements UnaryOperator<string, Ein> {
  operation(x: Ein): string {
    return x.toString();
  }
  apply(x: Result<Ein>): Result<string> {
    return applyUnary(this, x);
  }
  explain(x: Expression<Ein>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

class TinAsStringOperator implements UnaryOperator<string, Tin> {
  operation(x: Tin): string {
    return x.toString();
  }
  apply(x: Result<Tin>): Result<string> {
    return applyUnary(this, x);
  }
  explain(x: Expression<Tin>, factual: Factual): Explanation {
    return explainUnary(x, factual);
  }
}

const enumOperator = new EnumAsStringOperator();
const emailAddressOperator = new EmailAsStringOperator();
const dollarOperator = new DollarAsStringOperator();
const einOperator = new EinAsStringOperator();
const tinOperator = new TinAsStringOperator();

const create = (child: CompNode): CompNode => {
  if (child instanceof EnumNode) {
    return new StringNode(new UnaryExpression(child.expr, enumOperator));
  }
  if (child instanceof EmailAddressNode) {
    return new StringNode(
      new UnaryExpression(child.expr, emailAddressOperator)
    );
  }
  if (child instanceof DollarNode) {
    return new StringNode(new UnaryExpression(child.expr, dollarOperator));
  }
  if (child instanceof EinNode) {
    return new StringNode(new UnaryExpression(child.expr, einOperator));
  }
  if (child instanceof TinNode) {
    return new StringNode(new UnaryExpression(child.expr, tinOperator));
  }

  throw new Error(`cannot execute AsString on a ${child.constructor.name}`);
};

export const AsStringFactory: CompNodeFactory = {
  typeName: 'AsString',

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    const childConfig = e.children[0];
    const child = compNodeRegistry.fromDerivedConfig(
      childConfig,
      graph
    );
    return create(child);
  },

  create(nodes: CompNode[]): CompNode {
    return create(nodes[0]);
  },
};
