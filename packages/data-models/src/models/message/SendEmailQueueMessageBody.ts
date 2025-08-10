export interface SendEmailQueueMessageBody {
  to: string;
  languageCode: string;
  taxReturnId: string;
  submissionId: string;
  userId: string;
  emailId?: string;
  context?: Record<string, any>;
}
