import { TaxReturnSubmissionReceipt } from '../../../TaxReturnSubmissionReceipt';

export interface SubmissionConfirmationPayloadV1 {
  type: 'SubmissionConfirmationPayloadV1';
  receipts: TaxReturnSubmissionReceipt[];
}
