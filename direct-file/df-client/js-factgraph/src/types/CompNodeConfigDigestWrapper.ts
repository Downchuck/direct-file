export interface CompNodeConfigDigestWrapper {
    typeName: string;
    options: {
      path: string;
      module?: string;
    };
    children: CompNodeConfigDigestWrapper[];
  }
