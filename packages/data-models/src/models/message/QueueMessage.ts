import { QueueMessageHeaders } from './QueueMessageHeaders';

export interface QueueMessage<T> {
  payload: T;
  headers: QueueMessageHeaders;
}
