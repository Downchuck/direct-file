export interface SendEmailQueueMessageBody {
  to: string;
  languageCode: string;
  taxReturnId: string;
  submissionId: string;
  userId: string;
  id: string;
  context: any;
}

export enum HtmlTemplate {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  SUBMITTED = 'submitted',
  ERROR_RESOLVED = 'error_resolved',
  PRE_SUBMISSION_ERROR = 'pre_submission_error',
  POST_SUBMISSION_ERROR = 'post_submission_error',
  REMINDER_SUBMIT = 'reminder_submit',
  REMINDER_RESUBMIT = 'reminder_resubmit',
  REMINDER_STATE = 'reminder_state',
  NON_COMPLETION_SURVEY = 'non_completion_survey',
}

export interface SendEmailPayloadV1 {
  [key in HtmlTemplate]?: SendEmailQueueMessageBody[];
}

export interface QueueMessageHeaders {
  [key: string]: string;
}

export interface VersionedSendEmailMessage<T> {
  payload: T;
  headers: QueueMessageHeaders;
}
