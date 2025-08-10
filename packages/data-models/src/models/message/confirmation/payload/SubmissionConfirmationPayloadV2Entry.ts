import { TaxReturnSubmissionReceipt } from '../../../TaxReturnSubmissionReceipt';
import { SubmissionEventTypeEnum } from '../event/SubmissionEventTypeEnum';

export interface SubmissionConfirmationPayloadV2Entry {
  taxReturnSubmissionReceipt: TaxReturnSubmissionReceipt;
  eventType: SubmissionEventTypeEnum;
  metadata: Record<string, string>;
}
