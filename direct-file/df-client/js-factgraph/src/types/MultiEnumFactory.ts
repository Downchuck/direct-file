export const jsSetToScalaSet = <T>(set: Set<T>): T[] => {
    return Array.from(set);
  };

  export const MultiEnumFactory = (values: string[], optionsPath: string) => {
    return {
      right: {
        getValue: () => values,
        getEnumOptionsPath: () => optionsPath,
      },
    };
  };
