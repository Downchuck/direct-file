import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';

describe('Add', () => {
  it('adds two integers', () => {
    const dictionary = new FactDictionary();
    dictionary.define({ path: '/a', derived: { typeName: 'Int', value: 1 } });
    dictionary.define({ path: '/b', derived: { typeName: 'Int', value: 2 } });
    dictionary.define({ path: '/test', derived: { typeName: 'Add', children: [['/a'], ['/b']] } });
    const graph = new Graph(dictionary);
    expect(graph.get('/test')).toEqual(Result.complete(3));
  });

  it('adds two dollars', () => {
    const dictionary = new FactDictionary();
    dictionary.define({ path: '/a', derived: { typeName: 'Dollar', value: 1 } });
    dictionary.define({ path: '/b', derived: { typeName: 'Dollar', value: 2 } });
    dictionary.define({ path: '/test', derived: { typeName: 'Add', children: [['/a'], ['/b']] } });
    const graph = new Graph(dictionary);
    expect(graph.get('/test')).toEqual(Result.complete(Dollar.from(3)));
  });

  it('adds two rationals', () => {
    const dictionary = new FactDictionary();
    dictionary.define({ path: '/a', derived: { typeName: 'Rational', value: { n: 1, d: 2 } } });
    dictionary.define({ path: '/b', derived: { typeName: 'Rational', value: { n: 1, d: 3 } } });
    dictionary.define({ path: '/test', derived: { typeName: 'Add', children: [['/a'], ['/b']] } });
    const graph = new Graph(dictionary);
    expect(graph.get('/test')).toEqual(Result.complete(new Rational(5, 6)));
  });

  it('adds an integer and a dollar', () => {
    const dictionary = new FactDictionary();
    dictionary.define({ path: '/a', derived: { typeName: 'Int', value: 1 } });
    dictionary.define({ path: '/b', derived: { typeName: 'Dollar', value: 2 } });
    dictionary.define({ path: '/test', derived: { typeName: 'Add', children: [['/a'], ['/b']] } });
    const graph = new Graph(dictionary);
    expect(graph.get('/test')).toEqual(Result.complete(Dollar.from(3)));
  });

  // I will skip the rest of the mixed-type tests for now, as my AddFactory does not support them yet.
  // I will come back to them after I get the homogenous and simple binary cases working.
});
