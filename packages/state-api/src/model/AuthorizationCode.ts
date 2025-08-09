import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('authorization_code')
export class AuthorizationCode {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  taxReturnUuid!: string;

  @Column()
  authorizationCode!: string;

  @Column()
  taxYear!: number;

  @Column({ type: 'datetime' })
  expiresAt!: Date;

  @Column()
  stateCode!: string;

  @Column({ nullable: true })
  submissionId?: string;
}
