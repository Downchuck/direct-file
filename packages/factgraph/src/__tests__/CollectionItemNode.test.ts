import { CollectionItemNode } from '../compnodes/CollectionItemNode';
import { Expression } from '../Expression';
import { CollectionItem } from '../types/CollectionItem';
import { Result } from '../types/Result';
import { v4 as uuidv4 } from 'uuid';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { BooleanNode } from '../compnodes/BooleanNode';
import { Path } from '../Path';
import { SwitchExpression } from '../Expression';
import { DependencyExpression } from '../expressions/DependencyExpression';

describe('CollectionItemNode', () => {
  const factual = new Factual(new FactDictionary());

  describe('fromExpression', () => {
    it('creates a new node with the given expression', () => {
      const item = new CollectionItem(uuidv4());
      const node = new CollectionItemNode(Expression.literal(Result.incomplete()), undefined);
      const newNode = node['fromExpression'](Expression.literal(Result.complete(item)));
      const result = newNode.get(factual);
      expect(result.get).toEqual(item);
    });
  });

  describe('switch', () => {
    const item1 = new CollectionItem(uuidv4());
    const item2 = new CollectionItem(uuidv4());
    const node1 = new CollectionItemNode(Expression.literal(Result.complete(item1)), Path.fromString('/c1'));
    const node2 = new CollectionItemNode(Expression.literal(Result.complete(item2)), Path.fromString('/c1'));
    const node3 = new CollectionItemNode(Expression.literal(Result.complete(item2)), Path.fromString('/c2'));
    const trueNode = new BooleanNode(Expression.literal(Result.complete(true)));

    it('creates a Switch expression when aliases match', () => {
      const switched = node1.switch([[trueNode, node2]]);
      expect(switched).toBeInstanceOf(CollectionItemNode);
      expect(switched.expr).toBeInstanceOf(SwitchExpression);
    });

    it('throws an error when aliases do not match', () => {
      expect(() => node1.switch([[trueNode, node3]])).toThrow(
        'collection items in a <Switch> must reference the same collection'
      );
    });
  });

  describe('dependency', () => {
    it('creates a Dependency expression', () => {
      const node = new CollectionItemNode(Expression.literal(Result.incomplete()), undefined);
      const dep = node.dependency(Path.fromString('/test'));
      expect(dep).toBeInstanceOf(CollectionItemNode);
      expect(dep.expr).toBeInstanceOf(DependencyExpression);
    });
  });
});
