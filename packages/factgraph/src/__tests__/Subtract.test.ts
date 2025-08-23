import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types';

describe('Subtract', () => {
    it('subtracts two integers', () => {
        const dictionary = new FactDictionary();
        dictionary.define({ path: '/a', derived: { typeName: 'Int', value: 5 } });
        dictionary.define({ path: '/b', derived: { typeName: 'Int', value: 2 } });
        dictionary.define({ path: '/test', derived: { typeName: 'Subtract', children: [['/a'], ['/b']] } });
        const graph = new Graph(dictionary);
        expect(graph.get('/test')).toEqual(Result.complete(3));
    });
});
