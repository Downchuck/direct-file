import { CollectionNode } from '../compnodes/CollectionNode';
import { Expression } from '../Expression';
import { PathItem } from '../PathItem';
import '../compnodes';
import { Collection } from '../types/Collection';
import { CollectionItem } from '../types/CollectionItem';
import { Result } from '../types/Result';
import { v4 as uuidv4 } from 'uuid';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { BooleanNode } from '../compnodes/BooleanNode';
import { Path } from '../Path';
import { SwitchExpression } from '../Expression';
import { DependencyExpression } from '../expressions/DependencyExpression';

describe('CollectionNode', () => {
  const factual = new Factual(new FactDictionary());

  describe('extract', () => {
    const uuid = uuidv4();
    const collection = new Collection([uuid]);
    const collectionNode = new CollectionNode(
      Expression.literal(Result.complete(collection)),
      undefined
    );

    it('returns a CollectionItemNode when given a Member id', () => {
      const extract = collectionNode.extract(new PathItem('#' + uuid, 'collection-member'));
      expect(extract).toBeDefined();
      const result = extract!.get(factual);
      const collectionItem = result.get as CollectionItem;
      expect(collectionItem.id).toEqual('#' + uuid);
    });

    it('returns an incomplete CollectionItemNode when given an Unknown', () => {
      const extract = collectionNode.extract(PathItem.Unknown);
      expect(extract).toBeDefined();
      const result = extract!.get(factual);
      expect(result.isComplete).toBe(false);
    });

    it('returns nothing when given anything else', () => {
      const extract = collectionNode.extract(new PathItem('test', 'child'));
      expect(extract).toBeUndefined();
    });
  });

  describe('fromExpression', () => {
    it('throws an exception', () => {
      const node = new CollectionNode(Expression.literal(Result.incomplete()), undefined);
      expect(() => node['fromExpression'](Expression.literal(Result.incomplete()))).toThrow(
        'cannot create a Collection from an expression'
      );
    });
  });

  describe('switch', () => {
    const collection1 = new Collection([uuidv4()]);
    const collection2 = new Collection([uuidv4()]);
    const node1 = new CollectionNode(Expression.literal(Result.complete(collection1)), Path.fromString('/c1'));
    const node2 = new CollectionNode(Expression.literal(Result.complete(collection2)), Path.fromString('/c1'));
    const node3 = new CollectionNode(Expression.literal(Result.complete(collection2)), Path.fromString('/c2'));
    const trueNode = new BooleanNode(Expression.literal(Result.complete(true)));

    it('creates a Switch expression when aliases match', () => {
      const switched = node1.switch([[trueNode, node2]]);
      expect(switched).toBeInstanceOf(CollectionNode);
      expect(switched.expr).toBeInstanceOf(SwitchExpression);
    });

    it('throws an error when aliases do not match', () => {
      expect(() => node1.switch([[trueNode, node3]])).toThrow(
        'collections in a <Switch> must reference the same collection'
      );
    });
  });

  describe('dependency', () => {
    it('creates a Dependency expression', () => {
      const node = new CollectionNode(Expression.literal(Result.incomplete()), undefined);
      const dep = node.dependency(Path.fromString('/test'));
      expect(dep).toBeInstanceOf(CollectionNode);
      expect(dep.expr).toBeInstanceOf(DependencyExpression);
    });
  });
});
