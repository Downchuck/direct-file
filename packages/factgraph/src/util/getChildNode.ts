import { Graph } from '../Graph';
import { CompNode } from '../compnodes/CompNode';
import { compNodeRegistry } from '../compnodes/register-factories';

export function getChildNode(
  e: any,
  graph: Graph,
): CompNode {
  // This is a placeholder implementation.
  // The actual implementation will depend on how the config is structured.
  if (e.children) {
    const childConfig = e.children[0];
    return compNodeRegistry.fromDerivedConfig(childConfig, graph);
  }
  return compNodeRegistry.fromDerivedConfig(e, graph);
}
