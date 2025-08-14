import { compNodeRegistry } from '../compnodes/CompNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';
import { Result } from '../types';
import { Rational } from '../types/Rational';
import { Dollar } from '../types/Dollar';

describe('Divide', () => {
  const factual = new Factual(new FactDictionary());

  it('divides Rationals', () => {
    const node = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'Divide',
        children: [
          {
            typeName: 'Dividend',
            children: [
              {
                typeName: 'Rational',
                value: '1/2',
              },
            ],
          },
          {
            typeName: 'Divisors',
            children: [
              {
                typeName: 'Rational',
                value: '2/3',
              },
              {
                typeName: 'Rational',
                value: '3/4',
              },
            ],
          },
        ],
      },
      factual,
      new FactDictionary()
    );

    expect(node.get(factual)).toEqual(Result.complete(new Rational(1, 1)));
  });

  it('divides Dollars', () => {
    const node = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'Divide',
        children: [
          {
            typeName: 'Dividend',
            children: [
              {
                typeName: 'Dollar',
                value: '100.00',
              },
            ],
          },
          {
            typeName: 'Divisors',
            children: [
              {
                typeName: 'Dollar',
                value: '1.23',
              },
              {
                typeName: 'Dollar',
                value: '4.56',
              },
            ],
          },
        ],
      },
      factual,
      new FactDictionary()
    );

    expect(node.get(factual)).toEqual(
      Result.complete(Dollar.fromNumber(17.83))
    );
  });

  it('divides a long sequence of mixed types', () => {
    const node = compNodeRegistry.fromDerivedConfig(
      {
        typeName: 'Divide',
        children: [
          {
            typeName: 'Dividend',
            children: [
              {
                typeName: 'Rational',
                value: '6/7',
              },
            ],
          },
          {
            typeName: 'Divisors',
            children: [
              {
                typeName: 'Int',
                value: '1',
              },
              {
                typeName: 'Rational',
                value: '1/2',
              },
              {
                typeName: 'Dollar',
                value: '3.45',
              },
              {
                typeName: 'Rational',
                value: '1/2',
              },
              {
                typeName: 'Dollar',
                value: '0.1',
              },
              {
                typeName: 'Int',
                value: '5',
              },
            ],
          },
        ],
      },
      factual,
      new FactDictionary()
    );
    expect(node.get(factual)).toEqual(
      Result.complete(Dollar.fromNumber(2.0))
    );
  });

  describe('when dividing an Int and an Int', () => {
    it('returns a Rational', () => {
      const node = compNodeRegistry.fromDerivedConfig(
        {
          typeName: 'Divide',
          children: [
            {
              typeName: 'Dividend',
              children: [
                {
                  typeName: 'Int',
                  value: '1',
                },
              ],
            },
            {
              typeName: 'Divisors',
              children: [
                {
                  typeName: 'Int',
                  value: '2',
                },
              ],
            },
          ],
        },
        factual,
        new FactDictionary()
      );
      expect(node.get(factual)).toEqual(
        Result.complete(new Rational(1, 2))
      );
    });
  });
});
