import { TaxReturnIdAndSubmissionId } from '../../../TaxReturnIdAndSubmissionId';

export interface PendingSubmissionPayloadV1 {
  type: 'PendingSubmissionPayloadV1';
  pendings: TaxReturnIdAndSubmissionId[];
}
