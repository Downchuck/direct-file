import { FactGraph } from '../FactGraph';

export const CollectionItemReferenceFactory = (
  id: string,
  collectionPath: string,
  factGraph: FactGraph,
) => {
  return {
    right: {
      id,
      collectionPath,
    },
  };
};
