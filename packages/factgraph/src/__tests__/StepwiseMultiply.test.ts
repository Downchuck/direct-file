import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types/Result';
import { Dollar } from '../types/Dollar';
import { Rational } from '../types/Rational';

describe('StepwiseMultiply', () => {
  it('multiplies a dollar value by a rational value', () => {
    const dictionary = new FactDictionary();
    dictionary.define({
        path: '/test',
        derived: {
            typeName: 'StepwiseMultiply',
            children: [['/multiplicand'], ['/rate']]
        }
    });
    dictionary.define({ path: '/multiplicand', derived: { typeName: 'Dollar', value: 100 } });
    dictionary.define({ path: '/rate', derived: { typeName: 'Rational', value: { p: 1, q: 2 } } });

    const graph = new Graph(dictionary);
    expect(graph.get('/test')).toEqual(Result.complete(Dollar.fromNumber(50)));
  });
});
