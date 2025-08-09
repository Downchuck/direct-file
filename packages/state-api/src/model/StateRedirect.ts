import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('state_redirect')
export class StateRedirect {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  stateProfileId!: number;

  @Column()
  redirectUrl!: string;

  @Column({ type: 'datetime' })
  createdAt!: Date;

  @Column({ type: 'datetime', nullable: true })
  expiresAt?: Date;
}
