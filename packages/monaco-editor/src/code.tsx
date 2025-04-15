import Editor, { EditorProps, DiffEditor, DiffEditorProps } from '@monaco-editor/react';
import React from 'react';

export const CodeEditor = Editor;
export type CodeEditorProps = EditorProps;

export type CodeDiffEditorProps = DiffEditorProps & { value?: string, oldValue?: string }

export const CodeDiffEditor = (props: CodeDiffEditorProps) => {
  const { value, oldValue, modified, original, ...rest } = props;

  return <DiffEditor {...rest} modified={modified ?? value} original={original ?? oldValue} />;
};
