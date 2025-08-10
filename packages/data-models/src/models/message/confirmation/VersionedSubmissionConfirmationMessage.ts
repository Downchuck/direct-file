import { QueueMessage } from '../../QueueMessage';
import { QueueMessageHeaders } from '../../QueueMessageHeaders';
import { MessageHeaderAttribute } from '../../MessageHeaderAttribute';
import { AbstractSubmissionConfirmationPayload } from './payload/AbstractSubmissionConfirmationPayload';

export class VersionedSubmissionConfirmationMessage
  implements QueueMessage<AbstractSubmissionConfirmationPayload>
{
  constructor(
    public payload: AbstractSubmissionConfirmationPayload,
    public headers: QueueMessageHeaders
  ) {
    if (!headers.getAttribute(MessageHeaderAttribute.VERSION)) {
      throw new Error(
        'Unable to instantiate VersionedSubmissionConfirmationMessage. Headers must include a version attribute.'
      );
    }
  }
}
