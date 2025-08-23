import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';
import { Day } from '../types/Day';

describe('LessThan', () => {
  it('compares two integers and returns true', () => {
    const dictionary = new FactDictionary();
    dictionary.define({ path: '/a', derived: { typeName: 'Int', value: 2 } });
    dictionary.define({ path: '/b', derived: { typeName: 'Int', value: 5 } });
    dictionary.define({ path: '/test', derived: { typeName: 'LessThan', children: [['/a'], ['/b']] } });
    const graph = new Graph(dictionary);
    expect(graph.get('/test')).toEqual(Result.complete(true));
  });

  it('compares two integers and returns false', () => {
    const dictionary = new FactDictionary();
    dictionary.define({ path: '/a', derived: { typeName: 'Int', value: 5 } });
    dictionary.define({ path: '/b', derived: { typeName: 'Int', value: 2 } });
    dictionary.define({ path: '/test', derived: { typeName: 'LessThan', children: [['/a'], ['/b']] } });
    const graph = new Graph(dictionary);
    expect(graph.get('/test')).toEqual(Result.complete(false));
  });

  it('compares two equal integers and returns false', () => {
    const dictionary = new FactDictionary();
    dictionary.define({ path: '/a', derived: { typeName: 'Int', value: 5 } });
    dictionary.define({ path: '/b', derived: { typeName: 'Int', value: 5 } });
    dictionary.define({ path: '/test', derived: { typeName: 'LessThan', children: [['/a'], ['/b']] } });
    const graph = new Graph(dictionary);
    expect(graph.get('/test')).toEqual(Result.complete(false));
  });

  it('compares two dollars and returns true', () => {
    const dictionary = new FactDictionary();
    dictionary.define({ path: '/a', derived: { typeName: 'Dollar', value: 2 } });
    dictionary.define({ path: '/b', derived: { typeName: 'Dollar', value: 5 } });
    dictionary.define({ path: '/test', derived: { typeName: 'LessThan', children: [['/a'], ['/b']] } });
    const graph = new Graph(dictionary);
    expect(graph.get('/test')).toEqual(Result.complete(true));
  });

  it('compares two rationals and returns true', () => {
    const dictionary = new FactDictionary();
    dictionary.define({ path: '/a', derived: { typeName: 'Rational', value: { n: 1, d: 3 } } });
    dictionary.define({ path: '/b', derived: { typeName: 'Rational', value: { n: 1, d: 2 } } });
    dictionary.define({ path: '/test', derived: { typeName: 'LessThan', children: [['/a'], ['/b']] } });
    const graph = new Graph(dictionary);
    expect(graph.get('/test')).toEqual(Result.complete(true));
  });

  it('compares two days and returns true', () => {
    const dictionary = new FactDictionary();
    dictionary.define({ path: '/a', derived: { typeName: 'Day', value: '2024-03-10' } });
    dictionary.define({ path: '/b', derived: { typeName: 'Day', value: '2024-03-15' } });
    dictionary.define({ path: '/test', derived: { typeName: 'LessThan', children: [['/a'], ['/b']] } });
    const graph = new Graph(dictionary);
    expect(graph.get('/test')).toEqual(Result.complete(true));
  });
});
