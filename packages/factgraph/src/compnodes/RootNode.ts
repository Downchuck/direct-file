import { CompNode, DerivedNodeFactory } from './CompNode';
import { PathItem } from '../PathItem';
import { Graph } from '../Graph';
import { compNodeRegistry } from './registry';
import { Path } from '../Path';
import { Expression } from '../Expression';
import { Result } from '../types';

export class RootNode extends CompNode {
  constructor(private readonly graph: Graph) {
    super();
    this.expr = Expression.literal(Result.incomplete());
  }

  public override extract(key: PathItem): CompNode | undefined {
    const path = Path.fromString(key.toString());
    const definition = this.graph.dictionary.getDefinition(path);

    if (definition) {
      if (definition.writable) {
        return compNodeRegistry.fromWritableConfig(
          definition.writable,
          this.graph
        );
      }
      if (definition.derived) {
        return compNodeRegistry.fromDerivedConfig(
          definition.derived,
          this.graph
        );
      }
    }

    return undefined;
  }
}

export class RootNodeFactory implements DerivedNodeFactory {
  readonly typeName = 'Root';

  fromDerivedConfig(e: any, graph: Graph): CompNode {
    return new RootNode(graph);
  }
}
