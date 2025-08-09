import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('state_profile')
export class StateProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  accountId!: string;

  @Column()
  stateCode!: string;

  @Column()
  taxSystemName!: string;

  @Column()
  landingUrl!: string;

  @Column({ nullable: true })
  defaultRedirectUrl?: string;

  @Column({ nullable: true })
  departmentOfRevenueUrl?: string;

  @Column({ nullable: true })
  filingRequirementsUrl?: string;

  @Column({ nullable: true })
  transferCancelUrl?: string;

  @Column({ nullable: true })
  waitingForAcceptanceCancelUrl?: string;

  @Column({ nullable: true })
  certLocation?: string;

  @Column()
  acceptedOnly!: boolean;

  @Column({ type: 'datetime', nullable: true })
  certExpirationDate?: Date;

  @Column({ nullable: true })
  customFilingDeadline?: string;

  @Column()
  archived!: boolean;
}
