import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('state_language')
export class StateLanguage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  stateProfileId!: number;

  @Column()
  dfLanguageCode!: string;

  @Column()
  stateLanguageCode!: string;
}
