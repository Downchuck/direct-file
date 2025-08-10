import { QueueMessage } from '../../QueueMessage';
import { QueueMessageHeaders } from '../../QueueMessageHeaders';
import { MessageHeaderAttribute } from '../../MessageHeaderAttribute';
import { AbstractSendEmailPayload } from './payload/AbstractSendEmailPayload';

export class VersionedSendEmailMessage
  implements QueueMessage<AbstractSendEmailPayload>
{
  constructor(
    public payload: AbstractSendEmailPayload,
    public headers: QueueMessageHeaders
  ) {
    if (!headers.getAttribute(MessageHeaderAttribute.VERSION)) {
      throw new Error(
        'Unable to instantiate VersionedSendEmailMessage. Headers must include a version attribute.'
      );
    }
  }
}
