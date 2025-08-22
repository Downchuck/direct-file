import { BooleanNode } from '../compnodes/BooleanNode';
import { Expression } from '../expressions/Expression';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';
import { Graph } from '../Graph';

describe('BooleanNode', () => {
  let factual: Factual;

  beforeEach(() => {
    const dictionary = new FactDictionary();
    const graph = new Graph(dictionary);
    factual = new Factual(graph);
  });

  it('can be created with a true value', () => {
    const node = new BooleanNode(Expression.literal(true));
    expect(node.get(factual)).toEqual(Result.complete(true));
  });

  it('can be created with a false value', () => {
    const node = new BooleanNode(Expression.literal(false));
    expect(node.get(factual)).toEqual(Result.complete(false));
  });
});
