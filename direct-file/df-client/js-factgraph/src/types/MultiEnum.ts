export interface MultiEnum {
    getValue: () => Set<string>;
  }

  export const scalaSetToJsSet = <T>(set: T[]): Set<T> => {
    return new Set(set);
  };

  export const jsSetToScalaSet = <T>(set: Set<T>): T[] => {
    return Array.from(set);
  };
