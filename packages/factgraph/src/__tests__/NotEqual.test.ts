import {
  NotEqualFactory,
  IntNode,
  DollarNode,
  BooleanNode,
} from '../compnodes';
import { Result } from '../types';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';
import { Dollar } from '../types/Dollar';

describe('NotEqual', () => {
  const factual = new Factual(new FactDictionary());
  const factory = new NotEqualFactory();

  it('compares two different integers and returns true', () => {
    const node = factory.create(
      new IntNode(Expression.literal(Result.complete(2))),
      new IntNode(Expression.literal(Result.complete(5)))
    );
    expect(node.get(factual)).toEqual(Result.complete(true));
  });

  it('compares two equal integers and returns false', () => {
    const node = factory.create(
      new IntNode(Expression.literal(Result.complete(5))),
      new IntNode(Expression.literal(Result.complete(5)))
    );
    expect(node.get(factual)).toEqual(Result.complete(false));
  });

  it('compares two different dollars and returns true', () => {
    const node = factory.create(
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(2)))
      ),
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(5)))
      )
    );
    expect(node.get(factual)).toEqual(Result.complete(true));
  });

  it('compares two equal dollars and returns false', () => {
    const node = factory.create(
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(5)))
      ),
      new DollarNode(
        Expression.literal(Result.complete(Dollar.fromNumber(5)))
      )
    );
    expect(node.get(factual)).toEqual(Result.complete(false));
  });

  it('throws an error when comparing two different types', () => {
    expect(() => {
      factory.create(
        new IntNode(Expression.literal(Result.complete(5))),
        new DollarNode(
          Expression.literal(Result.complete(Dollar.fromNumber(5)))
        )
      );
    }).toThrow('cannot compare a IntNode and a DollarNode');
  });
});
