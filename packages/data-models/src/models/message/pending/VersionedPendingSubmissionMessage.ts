import { QueueMessage } from '../../QueueMessage';
import { QueueMessageHeaders } from '../../QueueMessageHeaders';
import { MessageHeaderAttribute } from '../../MessageHeaderAttribute';
import { AbstractPendingSubmissionPayload } from './payload/AbstractPendingSubmissionPayload';

export class VersionedPendingSubmissionMessage
  implements QueueMessage<AbstractPendingSubmissionPayload>
{
  constructor(
    public payload: AbstractPendingSubmissionPayload,
    public headers: QueueMessageHeaders
  ) {
    if (!headers.getAttribute(MessageHeaderAttribute.VERSION)) {
      throw new Error(
        'Unable to instantiate VersionedPendingSubmissionMessage. Headers must include a version attribute.'
      );
    }
  }
}
