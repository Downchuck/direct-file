import { Expression } from '../Expression';
import { Path } from '../Path';
import { Factual } from '../Factual';
import { CollectOperator } from '../operators/CollectOperator';

export class CollectExpression<A, B> extends Expression<B> {
    constructor(
        public readonly path: Path,
        public readonly childExpr: (item: Factual) => Expression<A>,
        public readonly op: CollectOperator<B, A>
    ) {
        super();
    }

    get(factual: any): any {
        throw new Error("Method not implemented.");
    }

    explain(factual: any): any {
        throw new Error("Method not implemented.");
    }
}
