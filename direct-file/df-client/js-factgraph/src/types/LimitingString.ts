export type LimitingString = string;

export const StringFactory = (value: string, regex: string) => {
  return {
    right: value,
  };
};

export interface StringValidationFailure {
  validationMessage: {
    toString: () => string;
  };
}
