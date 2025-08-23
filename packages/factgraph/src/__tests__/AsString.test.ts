import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types';
import { Dollar } from '../types/Dollar';
import { Ein } from '../types/Ein';
import { Tin } from '../types/Tin';
import { EmailAddress } from '../types/EmailAddress';

describe('AsString', () => {
    it('should convert EnumNode to StringNode', () => {
        const dictionary = new FactDictionary();
        dictionary.define({ path: '/a', derived: { typeName: 'Enum', value: 'a', options: ['a', 'b'] } });
        dictionary.define({ path: '/test', derived: { typeName: 'AsString', children: [['/a']] } });
        const graph = new Graph(dictionary);
        expect(graph.get('/test')).toEqual(Result.complete('a'));
    });

    it('should convert EmailAddressNode to StringNode', () => {
        const dictionary = new FactDictionary();
        dictionary.addDefinition({ path: '/a', derived: { typeName: 'EmailAddress', value: 'a@b.com' } });
        dictionary.addDefinition({ path: '/test', derived: { typeName: 'AsString', children: [['/a']] } });
        const graph = new Graph(dictionary);
        expect(graph.get('/test')).toEqual(Result.complete('a@b.com'));
    });

    it('should convert DollarNode to StringNode', () => {
        const dictionary = new FactDictionary();
        dictionary.addDefinition({ path: '/a', derived: { typeName: 'Dollar', value: 1.23 } });
        dictionary.addDefinition({ path: '/test', derived: { typeName: 'AsString', children: [['/a']] } });
        const graph = new Graph(dictionary);
        expect(graph.get('/test')).toEqual(Result.complete('1.23'));
    });

    it('should convert EinNode to StringNode', () => {
        const dictionary = new FactDictionary();
        dictionary.addDefinition({ path: '/a', derived: { typeName: 'Ein', value: '12-3456789' } });
        dictionary.addDefinition({ path: '/test', derived: { typeName: 'AsString', children: [['/a']] } });
        const graph = new Graph(dictionary);
        expect(graph.get('/test')).toEqual(Result.complete('12-3456789'));
    });

    it('should convert TinNode to StringNode', () => {
        const dictionary = new FactDictionary();
        dictionary.addDefinition({ path: '/a', derived: { typeName: 'Tin', value: '123-45-6789' } });
        dictionary.addDefinition({ path: '/test', derived: { typeName: 'AsString', children: [['/a']] } });
        const graph = new Graph(dictionary);
        expect(graph.get('/test')).toEqual(Result.complete('123-45-6789'));
    });
});
