import { CompNode } from './CompNode';
import { Expression } from '../Expression';

export class CollectionNode extends CompNode {
    constructor(readonly expr: Expression<any>) {
        super();
    }

    protected fromExpression(expr: Expression<any>): CompNode {
        throw new Error('Method not implemented.');
    }
}
