import { ConnectionOptions } from 'typeorm';
import config from '../config/config';

const options: ConnectionOptions = {
  type: 'postgres',
  host: config.postgresDb.host,
  port: config.postgresDb.port,
  username: config.postgresDb.username,
  password: config.postgresDb.password,
  database: config.postgresDb.database,
  logger: 'advanced-console',
  cli: {
    entitiesDir: './src/database/entities',
    migrationsDir: './src/database/migrations',
  },
  entities: [`${__dirname}/entities/**/*.Entity.ts`],
  migrations: [`${__dirname}/migrations/*.ts`],
};

export = options;
