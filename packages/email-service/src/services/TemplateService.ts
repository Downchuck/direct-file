import * as fs from 'fs/promises';
import * as path from 'path';
import * as handlebars from 'handlebars';

interface TemplateData {
  [key: string]: any;
}

class TemplateService {
  private templatesDir = path.join(__dirname, '..', 'templates');

  public async render(templateName: string, language: string, data: TemplateData): Promise<{ subject: string; html: string }> {
    const templatePath = path.join(this.templatesDir, language, `${templateName}.html`);
    const subjectPath = path.join(this.templatesDir, language, `${templateName}.json`);

    const [templateSource, subjectSource] = await Promise.all([
      fs.readFile(templatePath, 'utf-8'),
      fs.readFile(subjectPath, 'utf-8'),
    ]);

    const template = handlebars.compile(templateSource);
    const subjectData = JSON.parse(subjectSource);

    const html = template(data);
    const subject = subjectData.subject;

    return { subject, html };
  }
}

export default new TemplateService();
