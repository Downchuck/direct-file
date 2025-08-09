import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SendEmail } from './SendEmail';

@Entity('send_email_results')
export class SendEmailResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'is_sent' })
  isSent: boolean;

  @ManyToOne(() => SendEmail, (sendEmail) => sendEmail.results)
  @JoinColumn({ name: 'send_email_id' })
  sendEmail: SendEmail;
}
