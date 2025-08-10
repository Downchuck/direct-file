import { Action } from '../commands/Action';

export class ActionQueue {
  public inProgressActions: Action[] = [];
  public newActions: Action[] = [];
}
