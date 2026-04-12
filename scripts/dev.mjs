import { spawn } from 'node:child_process';
import process from 'node:process';

const shell = process.platform === 'win32';
const opts = { stdio: 'inherit', shell };

const api = spawn(
  'npm',
  ['run', 'dev', '-w', '@coffee-shop/api'],
  opts,
);
const web = spawn(
  'npm',
  ['run', 'dev', '-w', '@coffee-shop/web'],
  opts,
);

function shutdown(code) {
  api.kill();
  web.kill();
  process.exit(code ?? 0);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

api.on('exit', (code) => {
  if (code !== 0) shutdown(code);
});
web.on('exit', (code) => {
  if (code !== 0) shutdown(code);
});
