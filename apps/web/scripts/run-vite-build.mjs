/**
 * Gọi trực tiếp file vite.js bằng Node — không phụ thuộc PATH / .bin trên CI (Vercel workspace).
 * Thử lần lượt: node_modules trong apps/web, rồi node_modules ở root monorepo.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = join(__dirname, '..');

const candidates = [
  join(webRoot, 'node_modules', 'vite', 'bin', 'vite.js'),
  join(webRoot, '..', '..', 'node_modules', 'vite', 'bin', 'vite.js'),
];

let vitePath;
for (const p of candidates) {
  if (existsSync(p)) {
    vitePath = p;
    break;
  }
}

if (!vitePath) {
  console.error('[build] Không tìm thấy vite. Đã thử:\n', candidates.join('\n'));
  process.exit(1);
}

const result = spawnSync(process.execPath, [vitePath, 'build'], {
  stdio: 'inherit',
  cwd: webRoot,
  env: process.env,
});

process.exit(result.status === null ? 1 : result.status);
