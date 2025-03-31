// / <reference types="vitest/config" />
import { defineConfig, configDefaults, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';
export default mergeConfig(viteConfig, defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'src/index.ts'],
    environment: 'jsdom',
    globals: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [...(configDefaults.coverage.exclude ?? []), 'src/index.ts'],

    },
  },
}));
