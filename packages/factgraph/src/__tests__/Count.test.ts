import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types';

describe('Count', () => {
    it('counts the number of true values in a collection', () => {
        const dictionary = new FactDictionary();
        dictionary.define({
            path: '/count',
            derived: {
                typeName: 'Count',
                children: [['/collection/*/bool']],
            },
        });
        dictionary.define({
            path: '/collection',
            writable: { typeName: 'Collection' },
        });
        dictionary.define({
            path: '/collection/*/bool',
            writable: { typeName: 'Boolean' },
        });

        const graph = new Graph(dictionary);
        graph.set('/collection', [true, false, true, true, false]);
        expect(graph.get('/count')).toEqual(Result.complete(3));
    });

    it('returns 0 for an empty collection', () => {
        const dictionary = new FactDictionary();
        dictionary.define({
            path: '/count',
            derived: {
                typeName: 'Count',
                children: [['/collection/*/bool']],
            },
        });
        dictionary.define({
            path: '/collection',
            writable: { typeName: 'Collection' },
        });
        dictionary.define({
            path: '/collection/*/bool',
            writable: { typeName: 'Boolean' },
        });

        const graph = new Graph(dictionary);
        graph.set('/collection', []);
        expect(graph.get('/count')).toEqual(Result.complete(0));
    });

    it('returns 0 for a collection of all false values', () => {
        const dictionary = new FactDictionary();
        dictionary.define({
            path: '/count',
            derived: {
                typeName: 'Count',
                children: [['/collection/*/bool']],
            },
        });
        dictionary.define({
            path: '/collection',
            writable: { typeName: 'Collection' },
        });
        dictionary.define({
            path: '/collection/*/bool',
            writable: { typeName: 'Boolean' },
        });

        const graph = new Graph(dictionary);
        graph.set('/collection', [false, false, false]);
        expect(graph.get('/count')).toEqual(Result.complete(0));
    });
});
