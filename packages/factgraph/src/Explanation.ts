import { Path } from './Path';

export type Explanation =
  | ConstantExplanation
  | WritableExplanation
  | OperationExplanation
  | DependencyExplanation
  | NotAttachedToGraphExplanation;

export class ConstantExplanation {
  readonly _tag = 'ConstantExplanation';
}

export class WritableExplanation {
  readonly _tag = 'WritableExplanation';
  constructor(public readonly isComplete: boolean, public readonly path: Path) {}
}

export class OperationExplanation {
  readonly _tag = 'OperationExplanation';
  constructor(public readonly childList: Explanation[][]) {}
}

export class DependencyExplanation {
  readonly _tag = 'DependencyExplanation';
  constructor(
    public readonly isComplete: boolean,
    public readonly source: Path,
    public readonly target: Path,
    public readonly childList: Explanation[][]
  ) {}
}

export class NotAttachedToGraphExplanation {
  readonly _tag = 'NotAttachedToGraphExplanation';
}

export function getChildren(explanation: Explanation): Explanation[][] {
  switch (explanation._tag) {
    case 'OperationExplanation':
    case 'DependencyExplanation':
      return explanation.childList;
    default:
      return [];
  }
}

export function getSolves(explanation: Explanation): Path[][] {
  if (
    explanation._tag === 'WritableExplanation' &&
    !explanation.isComplete
  ) {
    return [[explanation.path]];
  }

  const children = getChildren(explanation);
  const expandedSets = children.map((set) =>
    set.map((explanation) => getSolves(explanation))
  );

  return expandedSets.flatMap((setOfSets) =>
    setOfSets.reduce((acc, newSets) => {
      if (acc.length === 0) {
        return newSets;
      }
      if (newSets.length === 0) {
        return acc;
      }
      const result = [];
      for (const set1 of acc) {
        for (const set2 of newSets) {
          result.push([...set1, ...set2]);
        }
      }
      return result;
    }, [] as Path[][])
  );
}

export function getIncompleteDependencies(
  explanation: Explanation
): [Path, Path][] {
  const result: [Path, Path][] = [];
  const findIncompleteDependencies = (
    list: Explanation[],
    acc: [Path, Path][]
  ): [Path, Path][] => {
    if (list.length === 0) {
      return acc;
    }
    const [explanation, ...next] = list;
    const children = getChildren(explanation).flat();
    const incompletes =
      explanation._tag === 'DependencyExplanation' && !explanation.isComplete
        ? [[explanation.source, explanation.target] as [Path, Path], ...acc]
        : acc;
    return findIncompleteDependencies([...children, ...next], incompletes);
  };
  return findIncompleteDependencies([explanation], result).reverse();
}

export function opWithInclusiveChildren(
  children: Explanation[]
): OperationExplanation {
  return new OperationExplanation([children]);
}

export function opWithExclusiveChildren(
  children: Explanation[]
): OperationExplanation {
  return new OperationExplanation(children.map((child) => [child]));
}
