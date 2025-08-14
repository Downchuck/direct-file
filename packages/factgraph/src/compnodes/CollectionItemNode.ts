import { CompNode } from './CompNode';
import { Expression } from '../Expression';

export class CollectionItemNode<T> extends CompNode {
    constructor(readonly expr: Expression<T>) {
        super();
    }

    protected fromExpression(expr: Expression<T>): CompNode {
        throw new Error('Method not implemented.');
    }
}
