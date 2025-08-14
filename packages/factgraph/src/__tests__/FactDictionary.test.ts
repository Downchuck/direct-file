import { FactDictionary } from '../FactDictionary';
import { Path } from '../Path';

describe('FactDictionary', () => {
  it('always creates a root fact', () => {
    const dictionary = new FactDictionary();
    const root = dictionary.getDefinition(Path.Root);
    expect(root).toBeDefined();
  });

  it('prevents new definitions from being added after frozen', () => {
    const dictionary = new FactDictionary();
    dictionary.freeze();
    expect(() => {
      dictionary.addDefinition({
        path: '/test',
        writable: { typeName: 'Int' },
      });
    }).toThrow();
  });

  it('adds a meta if you directly call directly', () => {
    const dictionary = new FactDictionary();
    const initialMeta = dictionary.getMeta();
    dictionary.addMeta({ version: '1' });
    expect(initialMeta.version).not.toEqual(dictionary.getMeta().version);
    expect(dictionary.getMeta().version).toEqual('1');
    expect(initialMeta.version).toEqual('Invalid');
  });

  it('it must be added to the dictionary before it is frozen', () => {
    const dictionary = new FactDictionary();
    expect(() => {
      dictionary.freeze();
      dictionary.addMeta({ version: '1' });
    }).toThrow();
  });

  it('it cannot be added into a frozen dictionary', () => {
    const dictionary = new FactDictionary();
    dictionary.addMeta({ version: '1' });
    dictionary.freeze();
    expect(() => {
      dictionary.addMeta({ version: '2' });
    }).toThrow();
  });
});
