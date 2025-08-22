import { CompNode } from './compnodes/CompNode';
import { compNodeRegistry } from './compnodes/registry';
import { Factual } from './Factual';
import { Path, PathItem } from './Path';
import { Graph } from './Graph';
import { MaybeVector, Result } from './types';
import { Explanation } from './Explanation';
import { CollectionNode } from './compnodes/CollectionNode';
import { FactDefinition } from './FactDictionary';
import { Expression } from './Expression';
import { DependencyExpression } from './expressions/DependencyExpression';

export class Fact {
  public children: Fact[] = [];
  public readonly isWritable: boolean;

  constructor(
    public value: CompNode,
    public readonly path: Path,
    public readonly graph: Graph,
    public readonly parent: Fact | undefined,
    public readonly definition: FactDefinition,
  ) {
    this.isWritable = !!definition.writable;
  }

  public get(factual: Factual): MaybeVector<Result<any>> {
    const childExpressions = this.children.map(c => new DependencyExpression(c.path));
    if (this.value instanceof CollectionNode) {
      const result = this.value.get(factual, ...childExpressions);
      return MaybeVector.of([result]);
    } else {
      const result = this.value.get(factual, ...childExpressions);
      return MaybeVector.of([result]);
    }
  }

  public set(factual: Factual, value: any): Fact {
    if (!this.isWritable) {
      throw new Error(`Fact at path ${this.path} is not writable`);
    }
    const newNode = this.value.set(factual, value);
    this.value = newNode;
    return this;
  }

  public explain(factual: Factual): Explanation {
    const childExpressions = this.children.map(c => new DependencyExpression(c.path));
    return this.value.explain(factual, ...childExpressions);
  }

  public apply(path: Path): MaybeVector<Fact> {
    if (path.absolute) {
      return this.graph.root.apply(path.relativeTo(Path.root));
    }
    if (path.isEmpty) {
      return MaybeVector.of([this]);
    }

    const item = path.items[0];
    const rest = path.slice(1);

    const childFacts = this.applyItem(item);

    return childFacts.flatMap(child => child.apply(rest));
  }

  public applyItem(item: PathItem): MaybeVector<Fact> {
    if (item.type === 'parent') {
      return this.parent ? MaybeVector.of([this.parent]) : MaybeVector.empty();
    }

    if (item.type === 'wildcard') {
      return new MaybeVector(this.children, true);
    }

    const matchingChild = this.children.find(c => c.path.endsWith(item));
    if (matchingChild) {
      return MaybeVector.of([matchingChild]);
    }

    const childFact = this.getChild(item);
    return childFact ? MaybeVector.of([childFact]) : MaybeVector.empty();
  }

  public getChild(item: PathItem): Fact | undefined {
    const childPath = this.path.append(item);

    const existing = this.children.find(c => c.path.equals(childPath));
    if (existing) {
        return existing;
    }

    const childDef = this.graph.dictionary.getDefinition(childPath);
    if (childDef) {
        const newFact = this.makeFact(childDef);
        this.children.push(newFact);
        return newFact;
    }

    const extractedNode = this.value.extract(item);
    if (extractedNode) {
        const extractedDef = new FactDefinition({ path: childPath.toString(), derived: { typeName: 'Extracted' } } as any);
        const fact = new Fact(extractedNode, childPath, this.graph, this, extractedDef);
        if (extractedNode instanceof CompNode) {
            (fact.value as any).path = childPath;
        }
        this.children.push(fact);
        return fact;
    }

    return undefined;
  }

  private makeFact(definition: FactDefinition): Fact {
    let node: CompNode;
    let childrenFacts: Fact[] = [];

    if (definition.derived) {
      const childrenPaths = (definition.derived.children || []).map((c: any) => Path.fromString(c[0]));
      childrenFacts = childrenPaths.map((p: Path) => {
        console.log(`makeFact: finding child at path: ${p.toString()}`);
        const factResult = this.graph.root.apply(p);
        if (factResult.values.length === 0) {
            throw new Error(`Could not find fact at path ${p}`);
        }
        const fact = factResult.values[0];
        if (!fact) throw new Error(`Could not find fact at path ${p}`);
        console.log(`makeFact: found child fact: ${fact.path.toString()}`);
        return fact;
      });
      const childrenNodes = childrenFacts.map((f: Fact) => f.value);
      node = this.graph.compNodeRegistry.fromDerivedConfig(definition.derived, this.graph, childrenNodes);
    } else if (definition.writable) {
      node = this.graph.compNodeRegistry.fromWritableConfig(definition.writable, this.graph);
    } else {
      throw new Error(`Fact definition for ${definition.path} has no derived or writable config`);
    }

    const fact = new Fact(node, definition.path, this.graph, this, definition);
    fact.children = childrenFacts;

    if (node instanceof CollectionNode) {
        (node as any).path = definition.path;
    }
    return fact;
  }
}
