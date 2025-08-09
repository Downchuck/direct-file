import { z } from 'zod';

// A placeholder for now. This will be expanded as I analyze more of the codebase.
export const WritableTypeSchema = z.any();
export type WritableType = z.infer<typeof WritableTypeSchema>;

export const ResultSchema = z.object({
  // In Scala, this was a generic type. In TypeScript, we can use `any` for now and refine it later.
  value: z.any(),
  isComplete: z.boolean(),
});
export type Result<T> = {
  value: T;
  isComplete: boolean;
};

// This is a simplified version of the Scala `MaybeVector`.
// It can hold a single value, multiple values, or be empty.
export class MaybeVector<T> {
  constructor(public values: T[], public isComplete: boolean) {}

  static single<T>(value: T, isComplete: boolean = true): MaybeVector<T> {
    return new MaybeVector([value], isComplete);
  }

  static multiple<T>(values: T[], isComplete: boolean = true): MaybeVector<T> {
    return new MaybeVector(values, isComplete);
  }

  static empty<T>(isComplete: boolean = true): MaybeVector<T> {
    return new MaybeVector([], isComplete);
  }
}
