import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { CompNode } from '../compnodes';

export function getChildNode(
  e: any,
  factual: Factual,
  factDictionary: FactDictionary
): CompNode {
  // This is a placeholder implementation.
  // The actual implementation will depend on how the config is structured.
  // For now, I'll assume the child node is the first element in the config.
  const childConfig = e.children[0];
  return factDictionary.nodeFromConfig(childConfig, factual);
}
