import { Dollar } from './Dollar';

export const DollarFactory = (value: string) => {
  return {
    right: Dollar.fromString(value),
  };
};
