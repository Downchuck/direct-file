import { RootNode } from '../compnodes/RootNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';
import { PathItem } from '../PathItem';
import { StringNode, StringNodeFactory } from '../compnodes/StringNode';
import { compNodeRegistry } from '../compnodes/registry';

describe('RootNode', () => {
  const factDictionary = new FactDictionary();
  factDictionary.addDefinition({
    path: '/myFact',
    derived: {
      typeName: 'String',
      value: 'hello',
    },
  });
  const factual = new Factual(factDictionary);
  compNodeRegistry.register(StringNodeFactory);


  it('can be created', () => {
    const node = new RootNode();
    expect(node.get(factual)).toEqual(Result.complete(null));
  });

  describe('extract', () => {
    it('extracts a fact from the graph', () => {
      const rootNode = new RootNode();
      const myFactNode = rootNode.extract(new PathItem('myFact', 'child'), factual);
      expect(myFactNode).toBeInstanceOf(StringNode);
      expect(myFactNode?.get(factual)).toEqual(Result.complete('hello'));
    });
  });
});
