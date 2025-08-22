import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types';
import { Address } from '../types/Address';
import '../compnodes/register-factories';

describe('AddressNode', () => {
  it('parses a derived value from a string', () => {
    const dictionary = new FactDictionary();
    dictionary.addDefinition({
      path: '/test',
      derived: {
        typeName: 'Address',
        value: '736 Jackson Place NW\nWashington, DC 20503'
      },
    });
    const graph = new Graph(dictionary);
    const expected = new Address('736 Jackson Place NW', 'Washington', '20503', 'DC');
    expect(graph.get('/test')).toEqual(Result.complete(expected));
  });

  it('can be used inside a switch statement', () => {
    const dictionary = new FactDictionary();
    dictionary.addDefinition({ path: '/case1', derived: { typeName: 'Boolean', value: false } });
    dictionary.addDefinition({ path: '/then1', derived: { typeName: 'Address', value: '736 Jackson Place NW\nWashington, DC 20503' } });
    dictionary.addDefinition({ path: '/case2', derived: { typeName: 'Boolean', value: true } });
    dictionary.addDefinition({ path: '/then2', derived: { typeName: 'Address', value: '718 Jackson Place NW\nWashington, DC 20503' } });
    dictionary.addDefinition({
        path: '/test',
        derived: {
            typeName: 'Switch',
            children: [['/case1', '/then1'], ['/case2', '/then2']]
        }
    });
    const graph = new Graph(dictionary);
    const expected = new Address('718 Jackson Place NW', 'Washington', '20503', 'DC');
    expect(graph.get('/test')).toEqual(Result.complete(expected));
  });

  it('can read and write a value', () => {
    const dictionary = new FactDictionary();
    dictionary.addDefinition({
      path: '/test',
      writable: { typeName: 'Address' },
    });
    const graph = new Graph(dictionary);
    expect(graph.get('/test').isComplete).toBe(false);

    const address = new Address('736 Jackson Place NW', 'Washington', '20503', 'DC');
    graph.set('/test', address);

    expect(graph.get('/test')).toEqual(Result.complete(address));
  });

  it('can extract the street address', () => {
    const dictionary = new FactDictionary();
    dictionary.addDefinition({
        path: '/test',
        writable: { typeName: 'Address' },
    });
    const graph = new Graph(dictionary);
    const address = new Address('736 Jackson Place NW', 'Washington', '20503', 'DC');
    graph.set('/test', address);

    expect(graph.get('/test/streetAddress')).toEqual(Result.complete('736 Jackson Place NW'));
  });
});
