import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'state-api.sqlite',
  synchronize: true,
  logging: false,
  entities: ['src/model/**/*.ts'],
  migrations: [],
  subscribers: [],
});
