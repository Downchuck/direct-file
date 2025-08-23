import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types';

describe('Equal', () => {
    it('returns false if the inputs are different', () => {
        const dictionary = new FactDictionary();
    dictionary.define({ path: '/a', derived: { typeName: 'Int', value: 1 } });
    dictionary.define({ path: '/b', derived: { typeName: 'Int', value: 2 } });
    dictionary.define({ path: '/test', derived: { typeName: 'Equal', children: [['/a'], ['/b']] } });
        const graph = new Graph(dictionary);
        expect(graph.get('/test')).toEqual(Result.complete(false));
    });

    it('returns true if the inputs are the same', () => {
        const dictionary = new FactDictionary();
        dictionary.define({ path: '/a', derived: { typeName: 'String', value: 'Test' } });
        dictionary.define({ path: '/b', derived: { typeName: 'String', value: 'Test' } });
        dictionary.define({ path: '/test', derived: { typeName: 'Equal', children: [['/a'], ['/b']] } });
        const graph = new Graph(dictionary);
        expect(graph.get('/test')).toEqual(Result.complete(true));
    });
});
