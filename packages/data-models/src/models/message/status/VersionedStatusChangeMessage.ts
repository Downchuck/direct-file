import { QueueMessage } from '../../QueueMessage';
import { QueueMessageHeaders } from '../../QueueMessageHeaders';
import { MessageHeaderAttribute } from '../../MessageHeaderAttribute';
import { AbstractStatusChangePayload } from './payload/AbstractStatusChangePayload';

export class VersionedStatusChangeMessage
  implements QueueMessage<AbstractStatusChangePayload>
{
  constructor(
    public payload: AbstractStatusChangePayload,
    public headers: QueueMessageHeaders
  ) {
    if (!headers.getAttribute(MessageHeaderAttribute.VERSION)) {
      throw new Error(
        'Unable to instantiate VersionedStatusChangeMessage. Headers must include a version attribute.'
      );
    }
  }
}
