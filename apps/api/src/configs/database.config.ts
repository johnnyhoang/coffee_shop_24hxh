/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  database: string;
  password: string;
  logging: string;
}

export const databaseConfig = (): DatabaseConfig => ({
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  logging: process.env.ENABLED_RDS_QUERY_LOG,
});
