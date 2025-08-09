import { EmailService } from './EmailService';
import TemplateService from './TemplateService';
import EmailRecordKeepingService from './EmailRecordKeepingService';
import SqsListenerService from './SqsListenerService';

const emailService = new EmailService();
const templateService = TemplateService;
const emailRecordKeepingService = new EmailRecordKeepingService();
const sqsListenerService = new SqsListenerService();

export { emailService, templateService, emailRecordKeepingService, sqsListenerService };
