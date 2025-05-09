import { Spin } from '@yimoka/antd';
import { JSONEditorProps } from '@yimoka/monaco-editor';
import React, { lazy, Suspense } from 'react';

const JSONEditorComponent = lazy(() => import('@yimoka/monaco-editor').then(module => ({
  default: module.JSONEditor,
})));

export const JSONEditor = (props: JSONEditorProps) => (
  <Suspense fallback={<Spin spinning={true} />}>
    <JSONEditorComponent {...props} />
  </Suspense>
);
