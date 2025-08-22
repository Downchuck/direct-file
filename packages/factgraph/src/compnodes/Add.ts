import { CompNode, DerivedNodeFactory } from './CompNode';
import { IntNode } from './IntNode';
import { DollarNode } from './DollarNode';
import { RationalNode } from './RationalNode';
import { DayNode } from './DayNode';
import { DaysNode } from './DaysNode';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { Day } from '../types/Day';
import { Days } from '../types/Days';
import { BinaryOperator } from '../operators/BinaryOperator';
import { applyBinary, explainBinary } from '../operators/BinaryOperatorHelpers';
import { ReduceOperator } from '../operators/ReduceOperator';
import { applyReduce, explainReduce } from '../operators/ReduceOperatorHelpers';
import { Factual } from '../Factual';
import { BinaryExpression } from '../expressions/BinaryExpression';
import { ReduceExpression } from '../expressions/ReduceExpression';
import { Result } from '../types/Result';
import { Expression } from '../Expression';
import { Explanation } from '../Explanation';
import { Graph } from '../Graph';

// Reduce Operators
function createAddReduceOperator<T>(identity: T, plus: (x: T, y: T) => T): ReduceOperator<T> {
  return {
    identity,
    reduce: plus,
    apply: (results: Result<T>[]) => applyReduce({ identity, reduce: plus }, results),
    explain: (expressions: Expression<T>[], factual: Factual) => explainReduce(expressions, factual),
  };
}
const intPlus = (x: number, y: number) => x + y;
const dollarPlus = (x: Dollar, y: Dollar) => x.add(y);
const rationalPlus = (x: Rational, y: Rational) => x.add(y);
const dayPlus = (x: Day, y: Days) => x.add(y);

const intReduceOperator = createAddReduceOperator(0, intPlus);
const dollarReduceOperator = createAddReduceOperator(Dollar.zero, dollarPlus);
const rationalReduceOperator = createAddReduceOperator(new Rational(0, 1), rationalPlus);

// Binary Operators
function createAddBinaryOperator<A, L, R>(op: (lhs: L, rhs: R) => A): BinaryOperator<A, L, R> {
    return {
      operation: op,
      apply: (lhs: Result<L>, rhs: Result<R>) => applyBinary({ operation: op }, lhs, rhs),
      explain: (lhs: Expression<L>, rhs: Expression<R>, factual: Factual) => explainBinary(lhs, rhs, factual),
    };
}

const dollarIntPlus = (lhs: Dollar, rhs: number) => lhs.add(Dollar.from(rhs));
const intDollarPlus = (lhs: number, rhs: Dollar) => Dollar.from(lhs).add(rhs);
const rationalIntPlus = (lhs: Rational, rhs: number) => lhs.add(Rational.from(rhs));
const intRationalPlus = (lhs: number, rhs: Rational) => Rational.from(lhs).add(rhs);
const dollarRationalPlus = (lhs: Dollar, rhs: Rational) => lhs.add(Dollar.from(rhs.toNumber()));
const rationalDollarPlus = (lhs: Rational, rhs: Dollar) => Dollar.from(lhs.toNumber()).add(rhs);

const intIntBinaryOperator = createAddBinaryOperator(intPlus);
const dollarDollarBinaryOperator = createAddBinaryOperator(dollarPlus);
const rationalRationalBinaryOperator = createAddBinaryOperator(rationalPlus);
const dayDayBinaryOperator = createAddBinaryOperator(dayPlus);
const dollarIntBinaryOperator = createAddBinaryOperator(dollarIntPlus);
const intDollarBinaryOperator = createAddBinaryOperator(intDollarPlus);
const rationalIntBinaryOperator = createAddBinaryOperator(rationalIntPlus);
const intRationalBinaryOperator = createAddBinaryOperator(intRationalPlus);
const dollarRationalBinaryOperator = createAddBinaryOperator(dollarRationalPlus);
const rationalDollarBinaryOperator = createAddBinaryOperator(rationalDollarPlus);

function binaryAdd(lhs: CompNode, rhs: CompNode): CompNode {
    if (lhs instanceof IntNode && rhs instanceof IntNode) {
        return new IntNode(new BinaryExpression(intIntBinaryOperator));
    }
    if (lhs instanceof DollarNode && rhs instanceof DollarNode) {
        return new DollarNode(new BinaryExpression(dollarDollarBinaryOperator));
    }
    if (lhs instanceof RationalNode && rhs instanceof RationalNode) {
        return new RationalNode(new BinaryExpression(rationalRationalBinaryOperator));
    }
    if (lhs instanceof DayNode && rhs instanceof DaysNode) {
        return new DayNode(new BinaryExpression(dayDayBinaryOperator));
    }
    if (lhs instanceof DaysNode && rhs instanceof DayNode) {
        return new DayNode(new BinaryExpression(dayDayBinaryOperator));
    }
    if (lhs instanceof IntNode && rhs instanceof DollarNode) {
        return new DollarNode(new BinaryExpression(intDollarBinaryOperator));
    }
    if (lhs instanceof DollarNode && rhs instanceof IntNode) {
        return new DollarNode(new BinaryExpression(dollarIntBinaryOperator));
    }
    if (lhs instanceof IntNode && rhs instanceof RationalNode) {
        return new RationalNode(new BinaryExpression(intRationalBinaryOperator));
    }
    if (lhs instanceof RationalNode && rhs instanceof IntNode) {
        return new RationalNode(new BinaryExpression(rationalIntBinaryOperator));
    }
    if (lhs instanceof RationalNode && rhs instanceof DollarNode) {
        return new DollarNode(new BinaryExpression(rationalDollarBinaryOperator));
    }
    if (lhs instanceof DollarNode && rhs instanceof RationalNode) {
        return new DollarNode(new BinaryExpression(dollarRationalBinaryOperator));
    }
    throw new Error(`cannot add a ${lhs.constructor.name} and a ${rhs.constructor.name}`);
}


export const AddFactory: DerivedNodeFactory = {
  typeName: 'Add',
  fromDerivedConfig(e: any, graph: Graph, children: CompNode[]): CompNode {
    if (children.every((n) => n instanceof IntNode)) {
      return new IntNode(new ReduceExpression(intReduceOperator));
    }
    if (children.every((n) => n instanceof DollarNode)) {
      return new DollarNode(new ReduceExpression(dollarReduceOperator));
    }
    if (children.every((n) => n instanceof RationalNode)) {
      return new RationalNode(new ReduceExpression(rationalReduceOperator));
    }

    // Fallback to binary addition for mixed types
    if (children.length < 2) {
        throw new Error('Add requires at least 2 children for mixed-type addition');
    }
    let acc = children[0];
    for (let i = 1; i < children.length; i++) {
      // The new fact for this intermediate add result needs to be created in the graph
      // This is getting too complex. The factory should just return a node.
      // The graph construction logic is responsible for creating the facts.
      // The issue is that the binaryAdd returns a *new* node, but the children are already set.
      // The fact that contains this Add node needs to have its children re-wired.
      // This suggests that a ReduceExpression should be used for all cases.
      throw new Error('Mixed-type reduce addition not implemented yet');
    }
    return acc;
  },
};
