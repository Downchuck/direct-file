import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types';
import '../compnodes/register-factories';

describe('AsDecimalString', () => {
  it('converts a rational to a decimal string with default scale', () => {
    const dictionary = new FactDictionary();
    dictionary.addDefinition({ path: '/a', derived: { typeName: 'Rational', value: { n: 1, d: 3 } } });
    dictionary.addDefinition({
      path: '/test',
      derived: {
        typeName: 'AsDecimalString',
        children: [['/a']],
      },
    });
    const graph = new Graph(dictionary);
    expect(graph.get('/test')).toEqual(Result.complete('0.33'));
  });

  it('converts a rational to a decimal string with specified scale', () => {
    const dictionary = new FactDictionary();
    dictionary.addDefinition({ path: '/a', derived: { typeName: 'Rational', value: { n: 1, d: 3 } } });
    dictionary.addDefinition({
      path: '/test',
      derived: {
        typeName: 'AsDecimalString',
        scale: 4,
        children: [['/a']],
      },
    });
    const graph = new Graph(dictionary);
    expect(graph.get('/test')).toEqual(Result.complete('0.3333'));
  });
});
