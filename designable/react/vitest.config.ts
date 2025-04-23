// / <reference types="vitest/config" />
import { defineConfig, configDefaults, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';
export default mergeConfig(viteConfig, defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'src/index.ts'],
    globals: true,
    coverage: {
      enabled: true,
      exclude: [...(configDefaults.coverage.exclude ?? []), 'src/index.ts'],
    },
  },
}));
