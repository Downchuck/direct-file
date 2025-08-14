import { CountOperator } from '../compnodes/Count';
import { Result } from '../types';
import { MaybeVector } from '../types/MaybeVector';
import { Thunk } from '../Thunk';

describe('Count', () => {
  it('counts the number of true values in a collection', () => {
    const values = [true, false, true, true, false].map((b) =>
      Thunk.of(Result.complete(b))
    );
    const vector = MaybeVector.multiple<Thunk<Result<boolean>>>(values, true);
    const operator = new CountOperator();
    const result = operator.apply(vector);
    expect(result).toEqual(Result.complete(3));
  });

  it('returns 0 for an empty collection', () => {
    const values: Thunk<Result<boolean>>[] = [];
    const vector = MaybeVector.multiple<Thunk<Result<boolean>>>(values, true);
    const operator = new CountOperator();
    const result = operator.apply(vector);
    expect(result).toEqual(Result.complete(0));
  });

  it('returns 0 for a collection of all false values', () => {
    const values = [false, false, false].map((b) =>
      Thunk.of(Result.complete(b))
    );
    const vector = MaybeVector.multiple<Thunk<Result<boolean>>>(values, true);
    const operator = new CountOperator();
    const result = operator.apply(vector);
    expect(result).toEqual(Result.complete(0));
  });
});
