import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types';

describe('Regex', () => {
  it('returns true when the input matches the pattern', () => {
    const dictionary = new FactDictionary();
    dictionary.addDefinition({
        path: '/test',
        derived: {
            typeName: 'Regex',
            children: [['/input'], ['/pattern']]
        }
    });
    dictionary.addDefinition({ path: '/input', derived: { typeName: 'String', value: 'hello world' } });
    dictionary.addDefinition({ path: '/pattern', derived: { typeName: 'String', value: '^hello' } });

    const graph = new Graph(dictionary);
    expect(graph.get('/test')).toEqual(Result.complete(true));
  });

  it('returns false when the input does not match the pattern', () => {
    const dictionary = new FactDictionary();
    dictionary.addDefinition({
        path: '/test',
        derived: {
            typeName: 'Regex',
            children: [['/input'], ['/pattern']]
        }
    });
    dictionary.addDefinition({ path: '/input', derived: { typeName: 'String', value: 'hello world' } });
    dictionary.addDefinition({ path: '/pattern', derived: { typeName: 'String', value: 'goodbye' } });

    const graph = new Graph(dictionary);
    expect(graph.get('/test')).toEqual(Result.complete(false));
  });
});
