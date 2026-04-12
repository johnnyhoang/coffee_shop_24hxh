const { DataSource } = require('typeorm');
require('dotenv').config();

if (
  !(
    process.env.DATABASE_HOST &&
    process.env.DATABASE_PORT &&
    process.env.DATABASE_USERNAME &&
    process.env.DATABASE_PASSWORD &&
    process.env.DATABASE_NAME
  )
) {
  console.error(
    'Database environment values are not configured. Please prepare .env file.',
  );
  process.exit(1);
}

const connectionSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/modules/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  logging: process.env.DATABASE_LOGGING === 'true',
});

module.exports = connectionSource;
