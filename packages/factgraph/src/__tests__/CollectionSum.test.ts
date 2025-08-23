import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';

describe('CollectionSum', () => {
    it('sums a collection of integers', () => {
        const dictionary = new FactDictionary();
        dictionary.addDefinition({
            path: '/collection',
            writable: { typeName: 'Collection' },
        });
        dictionary.addDefinition({
            path: '/collection/*',
            writable: { typeName: 'Int' },
        });
        dictionary.addDefinition({
            path: '/test',
            derived: {
                typeName: 'CollectionSum',
                children: [['/collection/*']],
            },
        });
        const graph = new Graph(dictionary);
        graph.set('/collection', [1, 2, 3]);
        expect(graph.get('/test')).toEqual(Result.complete(6));
    });

    it('sums a collection of dollars', () => {
        const dictionary = new FactDictionary();
        dictionary.addDefinition({
            path: '/collection',
            writable: { typeName: 'Collection' },
        });
        dictionary.addDefinition({
            path: '/collection/*',
            writable: { typeName: 'Dollar' },
        });
        dictionary.addDefinition({
            path: '/test',
            derived: {
                typeName: 'CollectionSum',
                children: [['/collection/*']],
            },
        });
        const graph = new Graph(dictionary);
        graph.set('/collection', [Dollar.from(1), Dollar.from(2), Dollar.from(3)]);
        expect(graph.get('/test')).toEqual(Result.complete(Dollar.from(6)));
    });

    it('sums a collection of rationals', () => {
        const dictionary = new FactDictionary();
        dictionary.addDefinition({
            path: '/collection',
            writable: { typeName: 'Collection' },
        });
        dictionary.addDefinition({
            path: '/collection/*',
            writable: { typeName: 'Rational' },
        });
        dictionary.addDefinition({
            path: '/test',
            derived: {
                typeName: 'CollectionSum',
                children: [['/collection/*']],
            },
        });
        const graph = new Graph(dictionary);
        graph.set('/collection', [new Rational(1, 2), new Rational(1, 3), new Rational(1, 6)]);
        expect(graph.get('/test')).toEqual(Result.complete(new Rational(1, 1)));
    });

    it('returns incomplete if the collection is incomplete', () => {
        const dictionary = new FactDictionary();
        dictionary.addDefinition({
            path: '/collection',
            // not writable, so incomplete
        });
        dictionary.addDefinition({
            path: '/test',
            derived: {
                typeName: 'CollectionSum',
                children: [['/collection/*']],
            },
        });
        const graph = new Graph(dictionary);
        expect(graph.get('/test').isComplete).toBe(false);
    });
});
