import { parse } from 'pg-connection-string';

type SslOption = false | { rejectUnauthorized: boolean };

/**
 * Parse DATABASE_URL thành các field riêng để driver pg luôn nhận password kiểu string
 * (tránh lỗi SASL: client password must be a string khi chỉ dùng option `url`).
 */
export function typeOrmOptionsFromDatabaseUrl(
  databaseUrl: string,
  ssl: SslOption,
) {
  const p = parse(databaseUrl);

  const portRaw = p.port;
  const port =
    portRaw !== undefined && portRaw !== null && String(portRaw) !== ''
      ? parseInt(String(portRaw), 10)
      : 5432;

  return {
    host: p.host != null && p.host !== '' ? String(p.host) : '127.0.0.1',
    port,
    username: p.user != null ? String(p.user) : '',
    password: p.password != null ? String(p.password) : '',
    database:
      p.database != null && p.database !== ''
        ? String(p.database)
        : 'postgres',
    ssl,
  };
}
