import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types';

describe('ZipCodeNode', () => {
  it('can be created as a writable node', () => {
    const dictionary = new FactDictionary();
    dictionary.addDefinition({
        path: '/test',
        writable: { typeName: 'ZipCode' }
    });
    const graph = new Graph(dictionary);
    expect(graph.get('/test').isComplete).toBe(false);
  });

  it('can be set and retrieved', () => {
    const dictionary = new FactDictionary();
    dictionary.addDefinition({
        path: '/test',
        writable: { typeName: 'ZipCode' }
    });
    const graph = new Graph(dictionary);
    graph.set('/test', '12345');
    expect(graph.get('/test')).toEqual(Result.complete('12345'));
  });
});
