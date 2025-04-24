// / <reference types="vitest/config" />
import { defineConfig, configDefaults, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

const exclude = ['src/index.ts', 'src/main.tsx', 'src/components/index.ts', 'src/demo/index.tsx', 'vite.demo.config.ts', '**/__demo__/**'];

export default mergeConfig(viteConfig, defineConfig({
  test: {
    exclude: [...configDefaults.exclude, ...exclude],
    environment: 'jsdom',
    globals: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [...(configDefaults.coverage.exclude ?? []), ...exclude],

    },
  },
}));
