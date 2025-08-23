import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types';
import { Dollar } from '../types/Dollar';

describe('Maximum', () => {
    it.skip('finds the maximum of integers', () => {
        const dictionary = new FactDictionary();
        dictionary.addDefinition({
            path: '/intTest',
            derived: {
                typeName: 'Maximum',
                children: [['/collection/*/int']],
            },
        });
        dictionary.addDefinition({
            path: '/collection',
            writable: { typeName: 'Collection' },
        });
        dictionary.addDefinition({
            path: '/collection/*/int',
            writable: { typeName: 'Int' },
        });

        const graph = new Graph(dictionary);
        graph.set('/collection', [1, 8, 5]);

        expect(graph.get('/intTest')).toEqual(Result.complete(8));
    });

    it.skip('finds the maximum of dollars', () => {
        const dictionary = new FactDictionary();
        dictionary.addDefinition({
            path: '/dollarTest',
            derived: {
                typeName: 'Maximum',
                children: [['/collection/*/dollar']],
            },
        });
        dictionary.addDefinition({
            path: '/collection',
            writable: { typeName: 'Collection' },
        });
        dictionary.addDefinition({
            path: '/collection/*/dollar',
            writable: { typeName: 'Dollar' },
        });

        const graph = new Graph(dictionary);
        graph.set('/collection', [Dollar.fromNumber(1.23), Dollar.fromNumber(8.45), Dollar.fromNumber(5.67)]);

        expect(graph.get('/dollarTest')).toEqual(Result.complete(Dollar.fromNumber(8.45)));
    });
});
