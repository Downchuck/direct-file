import { CompNode, CompNodeFactory, compNodeRegistry } from './CompNode';
import { BooleanNode } from './BooleanNode';
import { Factual } from '../Factual';
import { FactDictionary } from '../FactDictionary';

class SwitchFactory implements CompNodeFactory {
  readonly typeName = 'Switch';

  fromDerivedConfig(
    e: any,
    factual: Factual,
    factDictionary: FactDictionary
  ): CompNode {
    const cases = e.children
      .filter((c: any) => c.typeName === 'Case')
      .map((c: any) => {
        const when = compNodeRegistry.fromDerivedConfig(
          c.children.find((c: any) => c.typeName === 'When').children[0],
          factual,
          factDictionary
        ) as BooleanNode;
        const then = compNodeRegistry.fromDerivedConfig(
          c.children.find((c: any) => c.typeName === 'Then').children[0],
          factual,
          factDictionary
        );
        return [when, then];
      });

    if (cases.length === 0) {
      throw new Error('Switch must have at least one child node');
    }

    const [firstCase, ...restCases] = cases;
    const [firstWhen, firstThen] = firstCase;

    return firstThen.switch(cases);
  }
}

compNodeRegistry.register(new SwitchFactory());
