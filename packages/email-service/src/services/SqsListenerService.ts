import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { emailService, emailRecordKeepingService } from './index';
import { VersionedSendEmailMessage, SendEmailPayloadV1, HtmlTemplate } from '../models/sqs';

class SqsListenerService {
  private sqsClient: SQSClient;
  private queueUrl: string;

  constructor() {
    this.sqsClient = new SQSClient({ region: process.env.AWS_REGION });
    this.queueUrl = process.env.SQS_QUEUE_URL;
  }

  public async startListening(): Promise<void> {
    console.log('Starting SQS listener...');
    while (true) {
      try {
        const { Messages } = await this.sqsClient.send(
          new ReceiveMessageCommand({
            QueueUrl: this.queueUrl,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 20,
          })
        );

        if (Messages) {
          for (const message of Messages) {
            await this.processMessage(message);
            await this.sqsClient.send(
              new DeleteMessageCommand({
                QueueUrl: this.queueUrl,
                ReceiptHandle: message.ReceiptHandle,
              })
            );
          }
        }
      } catch (error) {
        console.error('Error receiving messages from SQS:', error);
      }
    }
  }

  private async processMessage(message: any): Promise<void> {
    try {
      const body: VersionedSendEmailMessage<SendEmailPayloadV1> = JSON.parse(message.Body);

      if (body.headers.version === 'V1') {
        for (const templateName in body.payload) {
          const emails = body.payload[templateName as HtmlTemplate];
          if (emails) {
            for (const email of emails) {
              let isSent = true;
              try {
                await emailService.sendEmail({
                  to: email.to,
                  templateName,
                  language: email.languageCode,
                  data: email.context,
                });
              } catch (error) {
                isSent = false;
                console.error(`Error sending email to ${email.to}`, error);
              } finally {
                await emailRecordKeepingService.recordEmail(email, templateName as HtmlTemplate, isSent);
              }
            }
          }
        }
      } else {
        console.error(`Unsupported message version: ${body.headers.version}`);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }
}

export default new SqsListenerService();
