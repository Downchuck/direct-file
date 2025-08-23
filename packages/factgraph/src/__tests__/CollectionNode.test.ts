import { CollectionNode } from '../compnodes/CollectionNode';
import { StringNode } from '../compnodes/StringNode';
import { PathItem } from '../PathItem';
import { Expression } from '../Expression';

describe('CollectionNode', () => {
  describe('extract', () => {
    it('returns the item node when extracting a member', () => {
      const itemNode = new StringNode(Expression.literal(''));
      const collectionNode = new CollectionNode(itemNode);

      const extracted = collectionNode.extract(new PathItem('#some-id', 'collection-member'));

      expect(extracted).toBe(itemNode);
    });

    it('returns the item node when extracting an unknown item', () => {
        const itemNode = new StringNode(Expression.literal(''));
        const collectionNode = new CollectionNode(itemNode);

        const extracted = collectionNode.extract(PathItem.Unknown);

        expect(extracted).toBe(itemNode);
    });

    it('returns undefined for other path item types', () => {
        const itemNode = new StringNode(Expression.literal(''));
        const collectionNode = new CollectionNode(itemNode);

        const extracted = collectionNode.extract(new PathItem('some-child', 'child'));

        expect(extracted).toBeUndefined();
    });
  });
});
