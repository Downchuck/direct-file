import { AsStringFactory } from '../compnodes/AsString';
import { EnumNode } from '../compnodes/EnumNode';
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
    const node = new EnumNode(
      Expression.literal(Result.complete(new Enum('a', ['a', 'b'])))
    );
    const stringNode = AsStringFactory.create([node]);
    expect(stringNode.get(factual)).toEqual(Result.complete('a'));
  });

  it('should convert EmailAddressNode to StringNode', () => {
    const node = new EmailAddressNode(
      Expression.literal(Result.complete(new EmailAddress('a@b.com')))
    );
    const stringNode = AsStringFactory.create([node]);
    expect(stringNode.get(factual)).toEqual(Result.complete('a@b.com'));
  });

  it('should convert DollarNode to StringNode', () => {
    const node = new DollarNode(
      Expression.literal(Result.complete(Dollar.fromNumber(1.23)))
    );
    const stringNode = AsStringFactory.create([node]);
    expect(stringNode.get(factual)).toEqual(Result.complete('1.23'));
  });

  it('should convert EinNode to StringNode', () => {
    const node = new EinNode(
      Expression.literal(Result.complete(Ein.fromString('12-3456789')))
    );
    const stringNode = AsStringFactory.create([node]);
    expect(stringNode.get(factual)).toEqual(Result.complete('12-3456789'));
  });

  it('should convert TinNode to StringNode', () => {
    const node = new TinNode(
      Expression.literal(Result.complete(Tin.fromString('123-45-6789')))
    );
    const stringNode = AsStringFactory.create([node]);
    expect(stringNode.get(factual)).toEqual(Result.complete('123-45-6789'));
  });
});
