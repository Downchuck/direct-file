import { Graph } from './Graph';
import { Path } from './Path';
import { MaybeVector, Result } from './types';
import { Explanation } from './Explanation';
import { Fact } from './Fact';

export class Factual {
  constructor(
    public readonly graph: Graph,
    private readonly scope: Path = Path.root,
  ) {}

  public get<T>(path: Path | string): Result<T> {
    return this.graph.get(this.resolve(path));
  }

  public getVect<T>(path: Path | string): MaybeVector<Result<T>> {
    return this.graph.getVect(this.resolve(path));
  }

  public getFact(path: Path | string): Fact {
    const p = this.resolve(path);
    const facts = this.graph.root.apply(p);
    if (facts.values.length !== 1) {
      throw new Error(`Path must resolve to a single value: ${p.toString()}`);
    }
    const factResult = facts.values[0];
    return factResult;
  }

  public getFacts(path: Path | string): MaybeVector<Fact> {
    return this.graph.root.apply(this.resolve(path));
  }

  public explain(path: Path | string): Explanation {
    return this.graph.explain(this.resolve(path));
  }

  public withScope(scope: Path): Factual {
    return new Factual(this.graph, scope);
  }

  private resolve(path: Path | string): Path {
    const p = path instanceof Path ? path : Path.fromString(path);
    if (p.absolute) {
      return p;
    }
    return this.scope.concat(p);
  }
}
