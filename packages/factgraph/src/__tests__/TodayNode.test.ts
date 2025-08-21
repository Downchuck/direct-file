import '../compnodes/register-factories';
import { compNodeRegistry } from '../compnodes/registry';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types/Result';
import { Day } from '../types/Day';
import { TodayNodeFactory } from '../compnodes/TodayNode';
import { IntNodeFactory } from '../compnodes/IntNode';
import { vi } from 'vitest';
import { utcToZonedTime } from 'date-fns-tz';

console.log('utcToZonedTime from test', utcToZonedTime);


describe('TodayNode', () => {
  const factual = new Factual(new FactDictionary());
  const graph = new Graph(factual);

  compNodeRegistry.register(TodayNodeFactory);
  compNodeRegistry.register(IntNodeFactory);

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the current date with the given offset', () => {
    const date = new Date('2024-01-20T00:00:00.000Z');
    vi.setSystemTime(date);

    const node = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'Today',
        children: [
          {
            typeName: 'Int',
            value: -5,
          },
        ],
      },
      graph
    );

    const result = node.get(factual);
    const day = result.get as Day;
    expect(day.year).toBe(2024);
    expect(day.month).toBe(1);
    // The day will be 19 because the date is set to midnight UTC, and the offset is -5
    expect(day.day).toBe(19);
  });
});
