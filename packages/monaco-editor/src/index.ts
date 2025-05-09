import { loader } from '@monaco-editor/react';

export * from './code';
export * from './json';

loader.config({
  paths: {
    vs: 'https://static.zxnum.com/npm/monaco-editor/0.52.2/min/vs',
  },
});

export { loader };
