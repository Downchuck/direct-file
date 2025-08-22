import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types';
import '../compnodes/register-factories';

describe('Subtract', () => {
    it('subtracts two integers', () => {
        const dictionary = new FactDictionary();
        dictionary.addDefinition({ path: '/a', derived: { typeName: 'Int', value: 5 } });
        dictionary.addDefinition({ path: '/b', derived: { typeName: 'Int', value: 2 } });
        dictionary.addDefinition({ path: '/test', derived: { typeName: 'Subtract', children: [['/a'], ['/b']] } });
        const graph = new Graph(dictionary);
        expect(graph.get('/test')).toEqual(Result.complete(3));
    });
});
