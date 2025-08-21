import { DependencyNode } from '../compnodes/Dependency';
import { DependencyExpression } from '../expressions/DependencyExpression';
import { Path } from '../Path';

describe('Dependency', () => {
  it('can be created with a path', () => {
    const path = Path.fromString('/a/b/c');
    const node = new DependencyNode(new DependencyExpression(path));
    expect(node.expr.path).toBe(path);
  });
});
