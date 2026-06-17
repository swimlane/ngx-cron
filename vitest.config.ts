import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vitest/config';

const root = path.dirname(fileURLToPath(import.meta.url));
const codemirrorShim = path.resolve(root, 'projects/swimlane/ngx-cron/src/test-setup/codemirror-shim.ts');

function codemirrorInteropPlugin(): Plugin {
  return {
    name: 'codemirror-interop-shim',
    enforce: 'pre',
    resolveId(source) {
      if (source === 'codemirror') {
        return codemirrorShim;
      }
    }
  };
}

export default defineConfig({
  plugins: [codemirrorInteropPlugin()],
  test: {
    server: {
      deps: {
        inline: ['@swimlane/ngx-ui', 'codemirror']
      }
    }
  }
});
