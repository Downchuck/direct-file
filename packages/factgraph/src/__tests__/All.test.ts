import { describe, it, expect } from '@jest/globals';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types/Result';
import { BooleanNode } from '../compnodes/BooleanNode';
import { Expression } from '../Expression';
import { All } from '../compnodes/All';
import '../compnodes/True';
import '../compnodes/False';
import { getChildren } from '../Explanation';

const TRUE = new BooleanNode(Expression.literal(Result.complete(true)));
const FALSE = new BooleanNode(Expression.literal(Result.complete(false)));
const PLACEHOLDER_TRUE = new BooleanNode(
  Expression.literal(Result.placeholder(true))
);
const PLACEHOLDER_FALSE = new BooleanNode(
  Expression.literal(Result.placeholder(false))
);
const INCOMPLETE = new BooleanNode(Expression.literal(Result.incomplete()));

const factual = new Factual(new FactDictionary());

describe('All', () => {
  it('returns true if all inputs are true', () => {
    const node = All([TRUE, TRUE, TRUE]);
    expect(node.get(factual)).toEqual(Result.complete(true));
  });

  it('returns false if any input is false', () => {
    const node = All([TRUE, TRUE, FALSE]);
    expect(node.get(factual)).toEqual(Result.complete(false));
  });

  it('stops evaluating after first false, complete result', () => {
    let canary = false;
    const CANARY_EXPR = new BooleanNode(
      Expression.thunk(() => {
        canary = true;
        return Result.complete(true);
      })
    );

    All([FALSE, CANARY_EXPR]).get(factual);
    expect(canary).toBe(false);

    All([TRUE, FALSE, CANARY_EXPR]).get(factual);
    expect(canary).toBe(false);
  });

  it("incomplete values don't interfere with falsy values", () => {
    const test1 = All([INCOMPLETE, FALSE]).get(factual);
    expect(test1).toEqual(Result.complete(false));

    const test2 = All([INCOMPLETE, INCOMPLETE, PLACEHOLDER_FALSE, INCOMPLETE]).get(
      factual
    );
    expect(test2).toEqual(Result.placeholder(false));

    const test3 = All([INCOMPLETE, INCOMPLETE, INCOMPLETE]).get(factual);
    expect(test3).toEqual(Result.incomplete());
  });

  it('evaluates (Complete(True), Incomplete) to Incomplete', () => {
    const test1 = All([TRUE, INCOMPLETE]).get(factual);
    expect(test1).toEqual(Result.incomplete());

    const test2 = All([INCOMPLETE, TRUE]).get(factual);
    expect(test2).toEqual(Result.incomplete());
  });

  it('evaluates (Placeholder(True), Incomplete) to Incomplete', () => {
    const test1 = All([PLACEHOLDER_TRUE, INCOMPLETE]).get(factual);
    expect(test1).toEqual(Result.incomplete());

    const test2 = All([INCOMPLETE, PLACEHOLDER_TRUE]).get(factual);
    expect(test2).toEqual(Result.incomplete());
  });

  it('evaluates (Placeholder(True), Complete(True)) to Placeholder(True)', () => {
    const test1 = All([PLACEHOLDER_TRUE, TRUE]).get(factual);
    expect(test1).toEqual(Result.placeholder(true));

    const test2 = All([TRUE, PLACEHOLDER_TRUE]).get(factual);
    expect(test2).toEqual(Result.placeholder(true));
  });

  it('evaluates (Placeholder(True), Placeholder(True)) to Placeholder(True)', () => {
    const test1 = All([PLACEHOLDER_TRUE, PLACEHOLDER_TRUE]).get(factual);
    expect(test1).toEqual(Result.placeholder(true));
  });

  it('evaluates (Complete(True), Complete(True)) to Complete(True)', () => {
    const test1 = All([TRUE, TRUE]).get(factual);
    expect(test1).toEqual(Result.complete(true));
  });

  it('evaluates (Placeholder(False), Incomplete) to Placeholder(False)', () => {
    const test1 = All([PLACEHOLDER_FALSE, INCOMPLETE]).get(factual);
    expect(test1).toEqual(Result.placeholder(false));

    const test2 = All([INCOMPLETE, PLACEHOLDER_FALSE]).get(factual);
    expect(test2).toEqual(Result.placeholder(false));
  });

  it('evaluates (Placeholder(False), Placeholder(True)) to Placeholder(False)', () => {
    const test1 = All([PLACEHOLDER_FALSE, PLACEHOLDER_TRUE]).get(factual);
    expect(test1).toEqual(Result.placeholder(false));

    const test2 = All([PLACEHOLDER_TRUE, PLACEHOLDER_FALSE]).get(factual);
    expect(test2).toEqual(Result.placeholder(false));
  });

  it('evaluates (Placeholder(False), Complete(True)) to Placeholder(False)', () => {
    const test1 = All([PLACEHOLDER_FALSE, TRUE]).get(factual);
    expect(test1).toEqual(Result.placeholder(false));

    const test2 = All([TRUE, PLACEHOLDER_FALSE]).get(factual);
    expect(test2).toEqual(Result.placeholder(false));
  });

  describe('.explain', () => {
    it('only explains a complete, false input if one is present', () => {
      const node = All([
        TRUE,
        FALSE,
        FALSE,
        PLACEHOLDER_TRUE,
        PLACEHOLDER_FALSE,
        INCOMPLETE,
      ]);
      const explanation = node.explain(factual);
      expect(getChildren(explanation)).toHaveLength(1);
    });

    it('provides exclusive explanations for all of its children otherwise', () => {
      const node = All([TRUE, PLACEHOLDER_TRUE, PLACEHOLDER_FALSE, INCOMPLETE]);
      const explanation = node.explain(factual);
      expect(getChildren(explanation)).toHaveLength(4);
    });
  });
});
