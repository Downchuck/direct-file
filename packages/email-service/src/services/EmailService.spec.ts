import { EmailService } from './EmailService';
import TemplateService from './TemplateService';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');
jest.mock('./TemplateService');

describe('EmailService', () => {
  it('should send an email correctly', async () => {
    const sendMailMock = jest.fn().mockResolvedValue(true);
    const createTransportMock = nodemailer.createTransport as jest.Mock;
    createTransportMock.mockReturnValue({
      sendMail: sendMailMock,
    });

    (TemplateService.render as jest.Mock).mockResolvedValue({
      subject: 'Test Subject',
      html: '<h1>Hello Jules</h1>',
    });

    const emailService = new EmailService();
    await emailService.sendEmail({
      to: 'test@example.com',
      templateName: 'test',
      language: 'en',
      data: { name: 'Jules' },
    });

    expect(sendMailMock).toHaveBeenCalledWith({
      from: process.env.EMAIL_FROM,
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<h1>Hello Jules</h1>',
    });
  });
});
