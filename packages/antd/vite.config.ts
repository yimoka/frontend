/* eslint-disable no-undef */
import * as path from 'path';
import process from 'process';

import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({ jsxRuntime: 'classic' }),
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
      name: 'YimokaAntd',
      fileName: format => `index.${format}.js`,
    },
    watch: process.env.VITE_WATCH ? { buildDelay: 100 } : null,
    outDir: path.resolve(__dirname, 'dist'),
    rollupOptions: {
      external: [
        'lodash-es',
        '@formily/core',
        '@formily/json-schema',
        '@formily/reactive',
        '@formily/react',
        '@yimoka/shared',
        '@yimoka/store',
        '@yimoka/react',
        'react',
        'react-is',
        'react-dom',
        'react-router-dom',
        'antd',
      ],
      output: {
        globals: {
          'lodash-es': '_',
          '@formily/core': 'Formily.Core',
          '@formily/json-schema': 'Formily.JSONSchema',
          '@formily/reactive': 'Formily.Reactive',
          '@formily/react': 'Formily.React',
          '@yimoka/shared': 'YimokaShared',
          '@yimoka/store': 'YimokaStore',
          '@yimoka/react': 'YimokaReact',
          react: 'React',
          'react-is': 'ReactIs',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM',
          antd: 'Antd',
        },
      },
    },
  },
});

