import '../compnodes';
import { Tin } from '../types/Tin';
import { TinNode } from '../compnodes/TinNode';
import { Expression } from '../Expression';
import { Result } from '../types';
import { PathItem } from '../PathItem';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';

// This is a workaround for the fact that TinNode is not exported from index.ts yet
import '../compnodes/TinNode';

describe('TinNode', () => {
  it('should be creatable with a constant value', () => {
    const tin = Tin.fromString('123456789');
    const tinNode = new TinNode(Expression.literal(Result.complete(tin)), false);
    expect(tinNode).toBeDefined();
  });

  it('should be creatable as a writable node', () => {
    const tinNode = new TinNode(Expression.literal(Result.incomplete()), false);
    expect(tinNode).toBeDefined();
  });

  it('should extract isSSN correctly', () => {
    const tin = Tin.fromString('123456789'); // a valid SSN
    const tinNode = new TinNode(Expression.literal(Result.complete(tin)), false);
    const isSsnNode = tinNode.extract(PathItem.fromString('isSSN'));
    expect(isSsnNode).toBeDefined();
    if (isSsnNode) {
        const factual = new Factual(new FactDictionary());
        const result = isSsnNode.get(factual);
        expect(result.isComplete).toBe(true);
        expect(result.value).toBe(true);
    }
  });

  it('should extract isITIN correctly', () => {
    const tin = Tin.fromString('900503456'); // a valid ITIN
    const tinNode = new TinNode(Expression.literal(Result.complete(tin)), false);
    const isItinNode = tinNode.extract(PathItem.fromString('isITIN'));
    expect(isItinNode).toBeDefined();
    if (isItinNode) {
        const factual = new Factual(new FactDictionary());
        const result = isItinNode.get(factual);
        expect(result.isComplete).toBe(true);
        expect(result.value).toBe(true);
    }
  });
});
