import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types/Result';
import { Day } from '../types/Day';
import '../compnodes/register-factories';
import { vi } from 'vitest';

describe('TodayNode', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

  it('returns the current date', () => {
    const date = new Date(2024, 0, 20); // Jan 20, 2024
    vi.setSystemTime(date);

    const dictionary = new FactDictionary();
    dictionary.addDefinition({
        path: '/test',
        derived: { typeName: 'Today' }
    });

    const graph = new Graph(dictionary);
    const result = graph.get('/test') as Result<Day>;

    expect(result.isComplete).toBe(true);
    expect(result.value?.year).toBe(2024);
    expect(result.value?.month).toBe(1);
    expect(result.value?.day).toBe(20);
  });
});
