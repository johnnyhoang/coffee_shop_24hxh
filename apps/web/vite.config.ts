import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import { fileURLToPath } from 'url';
import type { PluginOption } from 'vite';
import react from '@vitejs/plugin-react-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * react-virtualized (ES/CJS) có dòng chuỗi Flow cũ ở đầu file — Rollup/Vite cảnh báo "Module level directives".
 * Xóa trong transform, không sửa file trong node_modules.
 */
function reactVirtualizedStripFlowDirective(): PluginOption {
  const pattern = /^\s*['"]no babel-plugin-flow-react-proptypes['"];\s*\r?\n?/;

  return {
    name: 'vite:react-virtualized-strip-flow-directive',
    enforce: 'pre',
    transform(code, id) {
      const normalized = id.replace(/\\/g, '/');
      if (!normalized.includes('/react-virtualized/') || !id.endsWith('.js')) {
        return null;
      }
      if (!code.includes('babel-plugin-flow-react-proptypes')) {
        return null;
      }
      const next = code.replace(pattern, '');
      if (next === code) {
        return null;
      }
      return { code: next, map: null };
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
    plugins: [
      react(),
      viteTsconfigPaths(),
      svgr(),
      reactVirtualizedStripFlowDirective(),
    ],
    server: {
      host,
      port,
      open,
    },
    build: {
      outDir: 'build',
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return;
            }
            if (/[/\\]react-virtualized[/\\]/.test(id)) {
              return 'react-virtualized';
            }
            if (/[/\\]@mui[/\\]/.test(id)) {
              return 'mui';
            }
            if (/[/\\]@tanstack[/\\]/.test(id)) {
              return 'tanstack';
            }
            if (/[/\\]react-dom[/\\]/.test(id) || /[/\\]react[/\\]/.test(id)) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'react-router';
            }
          },
        },
      },
    },
  };
});
