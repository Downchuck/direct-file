import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types';

describe('CollectionSize', () => {
    it('calculates the size of a collection', () => {
        const dictionary = new FactDictionary();
        dictionary.addDefinition({
            path: '/collection',
            writable: { typeName: 'Collection' },
        });
        dictionary.addDefinition({
            path: '/collection/*',
            writable: { typeName: 'String' },
        });
        dictionary.addDefinition({
            path: '/test',
            derived: {
                typeName: 'CollectionSize',
                children: [['/collection']],
            },
        });

        const graph = new Graph(dictionary);
        graph.set('/collection', ['a', 'b', 'c']);
        expect(graph.get('/test')).toEqual(Result.complete(3));
    });

    it('returns 0 for an empty collection', () => {
        const dictionary = new FactDictionary();
        dictionary.addDefinition({
            path: '/collection',
            writable: { typeName: 'Collection' },
        });
        dictionary.addDefinition({
            path: '/collection/*',
            writable: { typeName: 'String' },
        });
        dictionary.addDefinition({
            path: '/test',
            derived: {
                typeName: 'CollectionSize',
                children: [['/collection']],
            },
        });

        const graph = new Graph(dictionary);
        graph.set('/collection', []);
        expect(graph.get('/test')).toEqual(Result.complete(0));
    });

    it('returns incomplete for an incomplete collection', () => {
        const dictionary = new FactDictionary();
        dictionary.addDefinition({
            path: '/collection',
            // This is not a writable fact, so it will be incomplete
        });
        dictionary.addDefinition({
            path: '/test',
            derived: {
                typeName: 'CollectionSize',
                children: [['/collection']],
            },
        });

        const graph = new Graph(dictionary);
        expect(graph.get('/test').isComplete).toBe(false);
    });
});
