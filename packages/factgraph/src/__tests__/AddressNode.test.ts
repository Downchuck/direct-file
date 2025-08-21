import { AddressNode } from '../compnodes/AddressNode';
import { compNodeRegistry } from '../compnodes/CompNode';
import { Expression } from '../Expression';
import { FactDictionary } from '../FactDictionary';
import { Factual } from '../Factual';
import { Result } from '../types';
import { Address } from '../types/Address';
import { PathItem } from '../PathItem';

import { AddressNodeFactory } from '../compnodes/AddressNode';
import { FalseFactory } from '../compnodes/False';
import { TrueFactory } from '../compnodes/True';
import { SwitchFactory } from '../compnodes/Switch';

describe('AddressNode', () => {
  const factual = new Factual(new FactDictionary());

  it('creates nodes from values', () => {
    const address = new Address(
      '736 Jackson Place NW',
      'Washington',
      '20503',
      'DC'
    );
    const node = new AddressNode(Expression.literal(Result.complete(address)));
    expect(node.get(factual)).toEqual(Result.complete(address));
  });

  it('parses config', () => {
    const node = AddressNodeFactory.fromDerivedConfig(
      { value: '736 Jackson Place NW\nWashington, DC 20503' },
      factual.graph
    ) as AddressNode;
    expect(node.get(factual)).toEqual(
      Result.complete(
        new Address('736 Jackson Place NW', 'Washington', '20503', 'DC')
      )
    );
  });

  it('can be used inside a switch statement', () => {
    const node = SwitchFactory.create([
      [
        FalseFactory.create(),
        AddressNodeFactory.fromDerivedConfig(
          { value: '736 Jackson Place NW\nWashington, DC 20503' },
          factual.graph
        ),
      ],
      [
        TrueFactory.create(),
        AddressNodeFactory.fromDerivedConfig(
          { value: '718 Jackson Place NW\nWashington, DC 20503' },
          factual.graph
        ),
      ],
    ]);

    expect(node.get(factual)).toEqual(
      Result.complete(
        new Address('718 Jackson Place NW', 'Washington', '20503', 'DC')
      )
    );
  });

  it('can read and write a value', () => {
    const dictionary = new FactDictionary();
    dictionary.addDefinition({
      path: '/test',
      writable: { typeName: 'Address' },
    });

    const graph = new Factual(dictionary);
    const fact = graph.getFact('/test');

    console.log('fact.get(graph).values[0]', fact.get(graph).values[0]);
    expect(fact.get(graph).values[0].isIncomplete).toBe(true);

    const address = new Address(
      '736 Jackson Place NW',
      'Washington',
      '20503',
      'DC'
    );
    fact.set(address);

    expect(fact.get(graph).values[0]).toEqual(Result.complete(address));
  });

  it('can gather the street address', () => {
    const node = new AddressNode(
      Expression.literal(
        Result.complete(
          new Address('736 Jackson Place NW', 'Washington', '20503', 'DC')
        )
      )
    );
    const streetAddress = node.extract(
      new PathItem('streetAddress', 'child')
    );
    expect(streetAddress?.get(factual)).toEqual(
      Result.complete('736 Jackson Place NW')
    );
  });
});
