import { Ein } from '../types/Ein';
import { EinNode } from '../compnodes/EinNode';
import { Expression } from '../Expression';
import { Result } from '../types';

// This is a workaround for the fact that EinNode is not exported from index.ts yet
import '../compnodes/EinNode';

describe('EinNode', () => {
  it('should be creatable with a constant value', () => {
    const ein = Ein.fromString('123456789');
    const einNode = new EinNode(Expression.literal(Result.complete(ein)));
    expect(einNode).toBeDefined();
  });

  it('should be creatable as a writable node', () => {
    const einNode = new EinNode(Expression.literal(Result.incomplete()));
    expect(einNode).toBeDefined();
  });
});
