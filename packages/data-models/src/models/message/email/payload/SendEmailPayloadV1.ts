import { HtmlTemplate } from '../../../email/HtmlTemplate';
import { SendEmailQueueMessageBody } from '../../SendEmailQueueMessageBody';

export interface SendEmailPayloadV1 {
  type: 'SendEmailPayloadV1';
  emails: Record<HtmlTemplate, SendEmailQueueMessageBody[]>;
}
