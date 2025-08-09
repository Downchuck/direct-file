import TemplateService from './TemplateService';
import * as fs from 'fs/promises';

jest.mock('fs/promises');

describe('TemplateService', () => {
  it('should render a template correctly', async () => {
    const readFileMock = fs.readFile as jest.Mock;
    readFileMock.mockImplementation((path: string) => {
      if (path.endsWith('.html')) {
        return Promise.resolve('<h1>Hello {{name}}</h1>');
      }
      if (path.endsWith('.json')) {
        return Promise.resolve('{ "subject": "Test Subject" }');
      }
      return Promise.reject(new Error('File not found'));
    });

    const { subject, html } = await TemplateService.render('test', 'en', { name: 'Jules' });

    expect(subject).toBe('Test Subject');
    expect(html).toBe('<h1>Hello Jules</h1>');
  });
});
