export interface ISynchronousDocumentStoreService {
  getObjectAsString(path: string): Promise<string>;
  write(path: string, data: Buffer): Promise<void>;
  getMostRecentFolderForPrefix(prefix: string): Promise<string | undefined>;
  getSubFolders(prefix: string): Promise<string[]>;
  getLeastRecentModifiedResourceForPrefix(prefix:string): Promise<{getLastModified: () => Date} | undefined>
  getObjectKeys(prefix: string): Promise<any[]>;
}
