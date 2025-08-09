import * as nodemailer from 'nodemailer';
import TemplateService from './TemplateService';

interface EmailOptions {
  to: string;
  templateName: string;
  language: string;
  data: { [key: string]: any };
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  public async sendEmail(options: EmailOptions): Promise<void> {
    const { to, templateName, language, data } = options;
    const { subject, html } = await TemplateService.render(templateName, language, data);

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
  }
}

export { EmailService };
