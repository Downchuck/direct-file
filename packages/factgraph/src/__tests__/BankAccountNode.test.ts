import { FactDictionary } from '../FactDictionary';
import { Graph } from '../Graph';
import { Result } from '../types';
import { BankAccount } from '../types/BankAccount';

describe('BankAccountNode', () => {
    it('can be created as a writable node', () => {
        const dictionary = new FactDictionary();
        dictionary.addDefinition({
            path: '/test',
            writable: { typeName: 'BankAccount' }
        });
        const graph = new Graph(dictionary);
        expect(graph.get('/test').isComplete).toBe(false);
    });

    it('can be set and retrieved', () => {
        const dictionary = new FactDictionary();
        dictionary.addDefinition({
            path: '/test',
            writable: { typeName: 'BankAccount' }
        });
        const graph = new Graph(dictionary);
        const bankAccount = new BankAccount('123456789', '987654321', 'CHECKING');
        graph.set('/test', bankAccount);
        expect(graph.get('/test')).toEqual(Result.complete(bankAccount));
    });
});
