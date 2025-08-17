import { Graph } from '../Graph';
import { CompNode } from '../compnodes/CompNode';
import { compNodeRegistry } from '../compnodes/registry';

export function getChildNode(
  e: any,
  graph: Graph,
): CompNode {
  // This is a placeholder implementation.
  // The actual implementation will depend on how the config is structured.
  // For now, I'll assume the child node is the first element in the config.
  const childConfig = e.children[0];
  return compNodeRegistry.fromDerivedConfig(childConfig, graph);
}
