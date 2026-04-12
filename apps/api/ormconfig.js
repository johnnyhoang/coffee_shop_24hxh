const path = require('path');
const { DataSource } = require('typeorm');
const { parse } = require('pg-connection-string');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const urlForCli =
  process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim();

const ssl =
  process.env.DB_SSL === 'true' || process.env.DATABASE_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false;

function optionsFromUrl(urlString) {
  const p = parse(urlString);
  const port =
    p.port !== undefined && p.port !== null && String(p.port) !== ''
      ? parseInt(String(p.port), 10)
      : 5432;
  return {
    type: 'postgres',
    host: p.host != null && p.host !== '' ? String(p.host) : '127.0.0.1',
    port,
    username: p.user != null ? String(p.user) : '',
    password: p.password != null ? String(p.password) : '',
    database:
      p.database != null && p.database !== ''
        ? String(p.database)
        : 'postgres',
    ssl,
    entities: ['dist/modules/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    logging: process.env.DATABASE_LOGGING === 'true',
  };
}

function buildOptions() {
  if (urlForCli) {
    return optionsFromUrl(urlForCli);
  }

  if (
    process.env.DATABASE_HOST &&
    process.env.DATABASE_PORT &&
    process.env.DATABASE_USERNAME &&
    process.env.DATABASE_PASSWORD !== undefined &&
    process.env.DATABASE_NAME
  ) {
    return {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: String(process.env.DATABASE_PASSWORD ?? ''),
      database: process.env.DATABASE_NAME,
      ssl,
      entities: ['dist/modules/**/*.entity.js'],
      migrations: ['dist/db/migrations/*.js'],
      logging: process.env.DATABASE_LOGGING === 'true',
    };
  }

  console.error(
    'Thiếu cấu hình DB: đặt DATABASE_URL hoặc DIRECT_URL (khuyến nghị cho migration), hoặc đủ DATABASE_HOST/PORT/USERNAME/PASSWORD/NAME.',
  );
  process.exit(1);
}

module.exports = new DataSource(buildOptions());
