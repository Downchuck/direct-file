import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { SendEmailResult } from './SendEmailResult';
import { HtmlTemplate } from './sqs';

@Entity('send_emails')
export class SendEmail {
  @PrimaryColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'tax_return_id', type: 'uuid' })
  taxReturnId: string;

  @Column({ name: 'submission_id' })
  submissionId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'language_code' })
  languageCode: string;

  @Column({ type: 'enum', enum: HtmlTemplate, name: 'email_type' })
  emailType: HtmlTemplate;

  @OneToMany(() => SendEmailResult, (result) => result.sendEmail)
  results: SendEmailResult[];
}
