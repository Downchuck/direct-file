import { createTin } from './Tin';

export const TinFactory = (value: string) => {
  return {
    right: createTin(value),
  };
};
