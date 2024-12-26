import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  './packages/store/vitest.config.ts',
  './project/console/vite.config.ts',
  './packages/react/vitest.config.ts',
  './packages/shared/vitest.config.ts',
]);
