export interface User {
  id: string; // UUIDs are represented as strings in TypeScript
  accessGranted: boolean;
  externalId: string; // UUID
  emailCipherText: string;
  tinCipherText: string;
  createdAt: Date;
  updatedAt: Date;
}
