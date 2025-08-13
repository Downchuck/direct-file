import { describe, it, expect } from '@jest/globals';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types/Result';
import { BooleanNode } from '../compnodes/BooleanNode';
import { Expression } from '../Expression';
import { Any } from '../compnodes/Any';
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

describe('Any', () => {
  it('returns true if any input is true', () => {
    const node = Any([FALSE, FALSE, TRUE]);
    expect(node.get(factual)).toEqual(Result.complete(true));
  });

  it('returns false only if all inputs are false', () => {
    const node = Any([FALSE, FALSE, FALSE]);
    expect(node.get(factual)).toEqual(Result.complete(false));
  });

  it('stops evaluating after first true, complete result', () => {
    let canary = false;
    const CANARY_EXPR = new BooleanNode(
      Expression.thunk(() => {
        canary = true;
        return Result.complete(true);
      })
    );

    Any([TRUE, CANARY_EXPR]).get(factual);
    expect(canary).toBe(false);

    Any([FALSE, TRUE, CANARY_EXPR]).get(factual);
    expect(canary).toBe(false);
  });

  it("incomplete values don't interfere with truthy values", () => {
    const test1 = Any([INCOMPLETE, TRUE]).get(factual);
    expect(test1).toEqual(Result.complete(true));

    const test2 = Any([INCOMPLETE, INCOMPLETE, PLACEHOLDER_TRUE, INCOMPLETE]).get(
      factual
    );
    expect(test2).toEqual(Result.placeholder(true));

    const test3 = Any([INCOMPLETE, INCOMPLETE, INCOMPLETE]).get(factual);
    expect(test3).toEqual(Result.incomplete());
  });

  it('evaluates (Complete(False), Incomplete) to Incomplete', () => {
    const test1 = Any([FALSE, INCOMPLETE]).get(factual);
    expect(test1).toEqual(Result.incomplete());

    const test2 = Any([INCOMPLETE, FALSE]).get(factual);
    expect(test2).toEqual(Result.incomplete());
  });

  it('evaluates (Placeholder(False), Incomplete) to Incomplete', () => {
    const test1 = Any([PLACEHOLDER_FALSE, INCOMPLETE]).get(factual);
    expect(test1).toEqual(Result.incomplete());

    const test2 = Any([INCOMPLETE, PLACEHOLDER_FALSE]).get(factual);
    expect(test2).toEqual(Result.incomplete());
  });

  it('evaluates (Placeholder(False), Complete(False)) to Placeholder(False)', () => {
    const test1 = Any([PLACEHOLDER_FALSE, FALSE]).get(factual);
    expect(test1).toEqual(Result.placeholder(false));

    const test2 = Any([FALSE, PLACEHOLDER_FALSE]).get(factual);
    expect(test2).toEqual(Result.placeholder(false));
  });

  it('evaluates (Placeholder(False), Placeholder(False)) to Placeholder(False)', () => {
    const test1 = Any([PLACEHOLDER_FALSE, PLACEHOLDER_FALSE]).get(factual);
    expect(test1).toEqual(Result.placeholder(false));
  });

  it('evaluates (Complete(False), Complete(False)) to Complete(False)', () => {
    const test1 = Any([FALSE, FALSE]).get(factual);
    expect(test1).toEqual(Result.complete(false));
  });

  it('evaluates (Placeholder(True), Incomplete) to Placeholder(True)', () => {
    const test1 = Any([PLACEHOLDER_TRUE, INCOMPLETE]).get(factual);
    expect(test1).toEqual(Result.placeholder(true));

    const test2 = Any([INCOMPLETE, PLACEHOLDER_TRUE]).get(factual);
    expect(test2).toEqual(Result.placeholder(true));
  });

  it('evaluates (Placeholder(True), Placeholder(False)) to Placeholder(True)', () => {
    const test1 = Any([PLACEHOLDER_TRUE, PLACEHOLDER_FALSE]).get(factual);
    expect(test1).toEqual(Result.placeholder(true));

    const test2 = Any([PLACEHOLDER_FALSE, PLACEHOLDER_TRUE]).get(factual);
    expect(test2).toEqual(Result.placeholder(true));
  });

  it('evaluates (Placeholder(True), Complete(False)) to Placeholder(True)', () => {
    const test1 = Any([PLACEHOLDER_TRUE, FALSE]).get(factual);
    expect(test1).toEqual(Result.placeholder(true));

    const test2 = Any([FALSE, PLACEHOLDER_TRUE]).get(factual);
    expect(test2).toEqual(Result.placeholder(true));
  });

  describe('.explain', () => {
    it('only explains a complete, true input if one is present', () => {
      const node = Any([
        FALSE,
        TRUE,
        TRUE,
        PLACEHOLDER_TRUE,
        PLACEHOLDER_FALSE,
        INCOMPLETE,
      ]);
      const explanation = node.explain(factual);
      expect(getChildren(explanation)).toHaveLength(1);
    });

    it('provides exclusive explanations for all of its children otherwise', () => {
      const node = Any([FALSE, PLACEHOLDER_TRUE, PLACEHOLDER_FALSE, INCOMPLETE]);
      const explanation = node.explain(factual);
      expect(getChildren(explanation)).toHaveLength(4);
    });
  });
});
