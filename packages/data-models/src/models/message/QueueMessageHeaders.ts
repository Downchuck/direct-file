import { MessageHeaderAttribute } from './MessageHeaderAttribute';

export class QueueMessageHeaders {
  private headers: Map<MessageHeaderAttribute, string>;

  constructor() {
    this.headers = new Map<MessageHeaderAttribute, string>();
  }

  public getAttribute(attribute: MessageHeaderAttribute): string | undefined {
    return this.headers.get(attribute);
  }

  public addHeader(attribute: MessageHeaderAttribute, value: string): this {
    this.headers.set(attribute, value);
    return this;
  }

  public toString(): string {
    return `QueueMessageHeaders{headers=${JSON.stringify(
      Object.fromEntries(this.headers)
    )}}`;
  }
}
