import { CompNode, CompNodeFactory } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { Graph } from '../Graph';
import { compNodeRegistry } from './registry';

export const SwitchFactory: CompNodeFactory = {
  typeName: 'Switch',

  fromDerivedConfig(
    e: any,
    graph: Graph
  ): CompNode {
    const cases = e.children
      .filter((c: any) => c.typeName === 'Case')
      .map((c: any) => {
        const when = compNodeRegistry.fromDerivedConfig(
          c.children.find((c: any) => c.typeName === 'When').children[0],
          graph
        ) as BooleanNode;
        const then = compNodeRegistry.fromDerivedConfig(
          c.children.find((c: any) => c.typeName === 'Then').children[0],
          graph
        );
        return [when, then];
      });

    return this.create(cases);
  },

  create(cases: [CompNode, CompNode][]): CompNode {
    if (cases.length === 0) {
      throw new Error('Switch must have at least one child node');
    }

    const [firstCase, ...restCases] = cases;
    const [firstWhen, firstThen] = firstCase;

    return firstThen.switch(cases);
  },
};
