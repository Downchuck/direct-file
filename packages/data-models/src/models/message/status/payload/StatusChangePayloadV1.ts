export interface StatusChangePayloadV1 {
  type: 'StatusChangePayloadV1';
  statusSubmissionIdMap: Record<string, string[]>;
}
