import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types';

describe('Any', () => {
    it('returns true if any input is true', () => {
        const dictionary = new FactDictionary();
        dictionary.define({ path: '/a', derived: { typeName: 'False' } });
        dictionary.define({ path: '/b', derived: { typeName: 'True' } });
        dictionary.define({ path: '/test', derived: { typeName: 'Any', children: [['/a'], ['/b']] } });
        const graph = new Graph(dictionary);
        expect(graph.get('/test')).toEqual(Result.complete(true));
    });

    it('returns false if all inputs are false', () => {
        const dictionary = new FactDictionary();
        dictionary.define({ path: '/a', derived: { typeName: 'False' } });
        dictionary.define({ path: '/b', derived: { typeName: 'False' } });
        dictionary.define({ path: '/test', derived: { typeName: 'Any', children: [['/a'], ['/b']] } });
        const graph = new Graph(dictionary);
        expect(graph.get('/test')).toEqual(Result.complete(false));
    });
});
