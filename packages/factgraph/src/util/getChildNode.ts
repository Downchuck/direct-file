import { Graph } from '../Graph';
import { CompNode } from '../compnodes/CompNode';
import { compNodeRegistry } from '../compnodes/registry';

export function getChildNode(
  e: any,
  graph: Graph,
): CompNode {
  if (e.children.length !== 1) {
    throw new Error('Expected exactly one child');
  }
  const child = e.children[0];
  if (child instanceof CompNode) {
    return child;
  }
  return compNodeRegistry.fromDerivedConfig(child, graph);
}
