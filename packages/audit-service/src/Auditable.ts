import { EventId, UserType } from './events';

export interface Auditable {
  event: EventId;
  type?: UserType;
}
