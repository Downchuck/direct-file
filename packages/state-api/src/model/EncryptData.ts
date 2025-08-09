export interface EncryptData {
  encodedSecret: string;
  encodedIV: string;
  encodedAndEncryptedData: string;
  encodedAuthenticationTag: string;
}
