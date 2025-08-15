import { IpPinNode } from '../compnodes';
import { IpPin } from '../types/IpPin';
import { Result } from '../types';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';

describe('IpPinNode', () => {
  it('can be created', () => {
    const factual = new Factual(new FactDictionary());
    const node = new IpPinNode(
      factual.getFact('/test').value.expr
    );
    expect(node).toBeDefined();
  });
});
