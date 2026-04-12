import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import { fileURLToPath } from 'url';
import type { PluginOption } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { readFile, writeFile } from 'fs/promises';
import viteTsconfigPaths from 'vite-tsconfig-paths';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

function reactVirtualized(): PluginOption {
  const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;

  return {
    name: 'my:react-virtualized',
    async configResolved() {
      const reactVirtualizedPath = path.dirname(
        fileURLToPath(import.meta.resolve('react-virtualized')),
      );

      const brokenFilePath = path.join(
        reactVirtualizedPath,
        '..',
        'es',
        'WindowScroller',
        'utils',
        'onScroll.js',
      );
      const brokenCode = await readFile(brokenFilePath, 'utf-8');

      const fixedCode = brokenCode.replace(WRONG_CODE, '');
      await writeFile(brokenFilePath, fixedCode);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Đọc .env từ thư mục apps/web (đúng cả khi chạy từ root monorepo)
  const env = loadEnv(mode, rootDir, '');

  const port = Number(env.DEV_SERVER_PORT || 5000);
  const host = env.DEV_SERVER_HOST || '0.0.0.0';
  const open = (env.DEV_OPEN || 'true').toLowerCase() === 'true';

  return {
    base: '/',
    envDir: rootDir,
    plugins: [react(), viteTsconfigPaths(), svgr(), reactVirtualized()],
    server: {
      host,
      port,
      open,
    },
    build: {
      outDir: 'build',
    },
  };
});
