import { AsStringFactory } from '../compnodes/AsString';
import { compNodeRegistry } from '../compnodes/CompNode';
import { StringNode } from '../compnodes/StringNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';

// This is a workaround for the fact that AsString is not exported from index.ts yet
import '../compnodes/AsString';
import '../compnodes/EnumNode';
import '../compnodes/EmailAddressNode';
import '../compnodes/DollarNode';
import '../compnodes/EinNode';
import '../compnodes/TinNode';

describe('AsString', () => {
    const factual = new Factual(new FactDictionary());

    it('should convert EnumNode to StringNode', () => {
        const enumConfig = {
            typeName: 'Enum',
            value: 'test',
            options: [{ name: 'optionsPath', value: 'options/path' }]
        };
        const asStringNode = new AsStringFactory().fromDerivedConfig({ children: [enumConfig] }, factual, factual.factDictionary);
        expect(asStringNode).toBeInstanceOf(StringNode);
        const result = asStringNode.get(factual);
        expect(result.isComplete).toBe(true);
        expect(result.get).toBe('test');
    });

    it('should convert EmailAddressNode to StringNode', () => {
        const emailConfig = {
            typeName: 'EmailAddress',
            value: 'test@example.com'
        };
        const asStringNode = new AsStringFactory().fromDerivedConfig({ children: [emailConfig] }, factual, factual.factDictionary);
        expect(asStringNode).toBeInstanceOf(StringNode);
        const result = asStringNode.get(factual);
        expect(result.isComplete).toBe(true);
        expect(result.get).toBe('test@example.com');
    });

    it('should convert DollarNode to StringNode', () => {
        const dollarConfig = {
            typeName: 'Dollar',
            value: '123.45'
        };
        const asStringNode = new AsStringFactory().fromDerivedConfig({ children: [dollarConfig] }, factual, factual.factDictionary);
        expect(asStringNode).toBeInstanceOf(StringNode);
        const result = asStringNode.get(factual);
        expect(result.isComplete).toBe(true);
        expect(result.get).toBe('123.45');
    });

    it('should convert EinNode to StringNode', () => {
        const einConfig = {
            typeName: 'EIN',
            value: '123456789'
        };
        const asStringNode = new AsStringFactory().fromDerivedConfig({ children: [einConfig] }, factual, factual.factDictionary);
        expect(asStringNode).toBeInstanceOf(StringNode);
        const result = asStringNode.get(factual);
        expect(result.isComplete).toBe(true);
        expect(result.get).toBe('12-3456789');
    });

    it('should convert TinNode to StringNode', () => {
        const tinConfig = {
            typeName: 'TIN',
            value: '123456789'
        };
        const asStringNode = new AsStringFactory().fromDerivedConfig({ children: [tinConfig] }, factual, factual.factDictionary);
        expect(asStringNode).toBeInstanceOf(StringNode);
        const result = asStringNode.get(factual);
        expect(result.isComplete).toBe(true);
        expect(result.get).toBe('123-45-6789');
    });
});
