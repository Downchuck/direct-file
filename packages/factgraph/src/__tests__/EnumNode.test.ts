import { Enum } from '../types/Enum';
import { EnumNode } from '../compnodes/EnumNode';
import { Expression } from '../Expression';
import { Result } from '../types';

// This is a workaround for the fact that EnumNode is not exported from index.ts yet
import '../compnodes/EnumNode';

describe('EnumNode', () => {
  it('should be creatable with a constant value', () => {
    const enumValue = Enum.fromString('test', 'options/path');
    const enumNode = new EnumNode(Expression.literal(Result.complete(enumValue)), 'options/path');
    expect(enumNode).toBeDefined();
  });

  it('should be creatable as a writable node', () => {
    const enumNode = new EnumNode(Expression.literal(Result.incomplete()), 'options/path');
    expect(enumNode).toBeDefined();
  });
});
