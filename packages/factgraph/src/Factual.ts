import { CompNode } from './compnodes/CompNode';
import { Path } from './Path';
import { Limit } from './limits/Limit';
import { MaybeVector, Result } from './types';
import { Explanation } from './Explanation';
import { Thunk } from './Thunk';
import { PathItem } from './PathItem';

export enum FactualSize {
  Single,
  Multiple,
}

export class FactualMeta {
  constructor(
    public readonly size: FactualSize,
    public readonly abstractPath: Path
  ) {}
}

export interface Factual {
  readonly value: CompNode;
  readonly path: Path;
  readonly meta: FactualMeta;
  readonly size: FactualSize;
  readonly abstractPath: Path;

  readonly limits: Limit[];
  get(): MaybeVector<Result<any>>;
  getThunk(): MaybeVector<Thunk<Result<any>>>;
  explain(): MaybeVector<Explanation>;

  isWritable(): boolean;

  apply(path: Path): MaybeVector<Result<Factual>>;
  apply(key: PathItem): MaybeVector<Result<Factual>>;
}
