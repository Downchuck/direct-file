import { QueueMessage } from '../../QueueMessage';
import { QueueMessageHeaders } from '../../QueueMessageHeaders';
import { MessageHeaderAttribute } from '../../MessageHeaderAttribute';
import { AbstractDispatchPayload } from './payload/AbstractDispatchPayload';

export class VersionedDispatchMessage
  implements QueueMessage<AbstractDispatchPayload>
{
  constructor(
    public payload: AbstractDispatchPayload,
    public headers: QueueMessageHeaders
  ) {
    if (!headers.getAttribute(MessageHeaderAttribute.VERSION)) {
      throw new Error(
        'Unable to instantiate VersionedDispatchMessage. Headers must include a version attribute.'
      );
    }
  }
}
