/* eslint-disable no-undef */
import * as path from 'path';
import process from 'process';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    dts({
      outDir: path.resolve(__dirname, 'types'),
      tsconfigPath: path.resolve(__dirname, 'tsconfig.app.json'),
    }),
  ],
  publicDir: false,
  build: {
    sourcemap: !process.env.VITE_WATCH,
    target: process.env.VITE_WATCH ? 'modules' : 'es2015',
    lib: {
      formats: ['cjs', 'es', 'umd'],
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'YimokaStore',
      fileName: format => `index.${format}.js`,
    },
    watch: process.env.VITE_WATCH ? { buildDelay: 100 } : null,
    outDir: path.resolve(__dirname, 'dist'),
    rollupOptions: {
      external: [
        'lodash-es',
      ],
      output: {
        globals: {
          'lodash-es': '_',
        },
      },
    },
  },
});

