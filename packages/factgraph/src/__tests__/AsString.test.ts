import { compNodeRegistry } from '../compnodes/registry';
import '../compnodes';
import { EmailAddressNode } from '../compnodes/EmailAddressNode';
import { DollarNode } from '../compnodes/DollarNode';
import { EinNode } from '../compnodes/EinNode';
import { TinNode } from '../compnodes/TinNode';
import { Result } from '../types/Result';
import { Factual } from '../Factual';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';
import { Enum } from '../types/Enum';
import { EmailAddress } from '../types/EmailAddress';
import { Dollar } from '../types/Dollar';
import { Ein } from '../types/Ein';
import { Tin } from '../types/Tin';

describe('AsString', () => {
  const factual = new Factual(new FactDictionary());

  it('should convert EnumNode to StringNode', () => {
    const stringNode = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'AsString',
        children: [
          { typeName: 'Enum', options: { value: 'a', enum: ['a', 'b'] } },
        ],
      },
      factual.graph
    );
    expect(stringNode.get(factual)).toEqual(Result.complete('a'));
  });

  it('should convert EmailAddressNode to StringNode', () => {
    const stringNode = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'AsString',
        children: [
          { typeName: 'EmailAddress', options: { value: 'a@b.com' } },
        ],
      },
      factual.graph
    );
    expect(stringNode.get(factual)).toEqual(Result.complete('a@b.com'));
  });

  it('should convert DollarNode to StringNode', () => {
    const stringNode = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'AsString',
        children: [
          { typeName: 'Dollar', options: { value: 1.23 } },
        ],
      },
      factual.graph
    );
    expect(stringNode.get(factual)).toEqual(Result.complete('1.23'));
  });

  it('should convert EinNode to StringNode', () => {
    const stringNode = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'AsString',
        children: [
          { typeName: 'Ein', options: { value: '12-3456789' } },
        ],
      },
      factual.graph
    );
    expect(stringNode.get(factual)).toEqual(Result.complete('12-3456789'));
  });

  it('should convert TinNode to StringNode', () => {
    const stringNode = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'AsString',
        children: [
          { typeName: 'TIN', options: { value: '123-45-6789' } },
        ],
      },
      factual.graph
    );
    expect(stringNode.get(factual)).toEqual(Result.complete('123-45-6789'));
  });
});
