import { SubmissionConfirmationPayloadV1 } from './SubmissionConfirmationPayloadV1';
import { SubmissionConfirmationPayloadV2 } from './SubmissionConfirmationPayloadV2';

export type AbstractSubmissionConfirmationPayload =
  | SubmissionConfirmationPayloadV1
  | SubmissionConfirmationPayloadV2;
