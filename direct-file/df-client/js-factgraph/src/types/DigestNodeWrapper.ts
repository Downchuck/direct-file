export class DigestNodeWrapper {
    constructor(path: string, writable: boolean, derived: boolean, placeholder: boolean) {}
  }

  export const DigestNodeWrapperFactory = {
    toNative: (wrapper: DigestNodeWrapper) => {
      return {};
    },
  };
