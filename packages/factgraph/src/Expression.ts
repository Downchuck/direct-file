import { MaybeVector, Result } from './types';

export class Expression<T> {
  public get(): MaybeVector<Result<T>> {
    throw new Error('Not implemented');
  }

  public getThunk(): MaybeVector<Result<T>> {
    throw new Error('Not implemented');
  }

  public explain(): MaybeVector<any> {
    throw new Error('Not implemented');
  }

  public set(value: any, allowCollectionItemDelete: boolean = false): void {
    throw new Error('Not implemented');
  }

  public delete(): void {
    throw new Error('Not implemented');
  }

  public get isWritable(): boolean {
    throw new Error('Not implemented');
  }
}
