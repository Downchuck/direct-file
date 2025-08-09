import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SendEmail } from './models/SendEmail';
import { SendEmailResult } from './models/SendEmailResult';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: [SendEmail, SendEmailResult],
  migrations: [],
  subscribers: [],
});
