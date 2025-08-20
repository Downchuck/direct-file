import '../compnodes';
import { All } from '../compnodes/All';
import { BooleanNode } from '../compnodes/BooleanNode';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { vi } from 'vitest';
import {
  opWithInclusiveChildren,
  ConstantExplanation,
  OperationExplanation,
} from '../Explanation';
import { FactDictionary } from '../FactDictionary';

const True = () =>
  new BooleanNode(Expression.literal(Result.complete(true)));
const False = () =>
  new BooleanNode(Expression.literal(Result.complete(false)));

class MockExpression extends Expression<boolean> {
  constructor(private val: Result<boolean>) {
    super();
  }
  get() {
    return this.val;
  }
  explain() {
    return new ConstantExplanation();
  }
  getThunk() {
    return super.getThunk(new Factual(new FactDictionary()));
  }
  set() {}
  delete() {}
  override get isWritable(): boolean {
    return false;
  }
}

describe('All', () => {
  const factual = new Factual(new FactDictionary());

  it('returns true if all inputs are true', () => {
    const node = All([True(), True(), True()]);
    expect(node.get(factual)).toEqual(Result.complete(true));
  });

  it('returns false if any input is false', () => {
    const node = All([True(), True(), False()]);
    expect(node.get(factual)).toEqual(Result.complete(false));
  });

  it('stops evaluating after first false child', () => {
    let canary = false;
    const canaryExpr = new MockExpression(Result.complete(true));
    vi.spyOn(canaryExpr, 'get').mockImplementation(() => {
      canary = true;
      return Result.complete(true);
    });

    All([False(), new BooleanNode(canaryExpr)]).get(factual);
    expect(canary).toBe(false);

    canary = false;
    All([True(), False(), new BooleanNode(canaryExpr)]).get(factual);
    expect(canary).toBe(false);
  });

  describe('explain', () => {
    it('only explains a complete, false input if one is present', () => {
      const node = All([
        True(),
        False(),
        new BooleanNode(new MockExpression(Result.incomplete())),
      ]);
      const explanation = node.explain(factual);
      expect(explanation).toEqual(
        opWithInclusiveChildren([new ConstantExplanation()])
      );
    });

    it('provides exclusive explanations for all of its children otherwise', () => {
      const node = All([
        True(),
        new BooleanNode(new MockExpression(Result.incomplete())),
      ]);
      const explanation = node.explain(factual) as OperationExplanation;
      expect(explanation.childList.length).toBe(1);
      expect(explanation.childList[0].length).toBe(2);
    });
  });
});
