import { Day } from './Day';

export const DayFactory = (value: string) => {
  return {
    right: Day.fromString(value),
  };
};
