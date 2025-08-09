export const EnumFactory = (value: string, optionsPath: string) => {
    return {
      right: {
        getValue: () => value,
        getEnumOptionsPath: () => optionsPath,
      },
    };
  };
