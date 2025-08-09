import { AppDataSource } from '../data-source';
import { SendEmail } from '../models/SendEmail';
import { SendEmailResult } from '../models/SendEmailResult';
import { SendEmailQueueMessageBody, HtmlTemplate } from '../models/sqs';

class EmailRecordKeepingService {
  private sendEmailRepository = AppDataSource.getRepository(SendEmail);
  private sendEmailResultRepository = AppDataSource.getRepository(SendEmailResult);

  public async recordEmail(email: SendEmailQueueMessageBody, emailType: HtmlTemplate, isSent: boolean): Promise<void> {
    const sendEmail = new SendEmail();
    sendEmail.id = email.id;
    sendEmail.taxReturnId = email.taxReturnId;
    sendEmail.submissionId = email.submissionId;
    sendEmail.userId = email.userId;
    sendEmail.languageCode = email.languageCode;
    sendEmail.emailType = emailType;

    await this.sendEmailRepository.save(sendEmail);

    const sendEmailResult = new SendEmailResult();
    sendEmailResult.sendEmail = sendEmail;
    sendEmailResult.isSent = isSent;

    await this.sendEmailResultRepository.save(sendEmailResult);
  }
}

export default new EmailRecordKeepingService();
