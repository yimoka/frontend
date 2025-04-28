import Editor, { EditorProps } from '@monaco-editor/react';
import { JSONParse, JSONStringify } from '@yimoka/shared';
import { isEqual } from 'lodash-es';
import { editor } from 'monaco-editor';
import React, { useEffect, useState } from 'react';

export const JSONEditor = (props: JSONEditorProps) => {
  const { value, valueType, onChange, onParseError, ...rest } = props;
  const [localValue, setLocalValue] = useState<string | undefined>('');

  useEffect(() => {
    if (typeof value === 'object') {
      if (!localValue || !isEqual(value, JSONParse(localValue))) {
        setLocalValue(JSONStringify(value, '', null, 2));
      }
    } else if (value !== localValue) {
      setLocalValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Editor
      theme='vs-dark'
      {...rest}
      language='json'
      value={localValue}
      onChange={(value, ev) => {
        setLocalValue(value);
        if (valueType !== 'object') {
          onChange?.(value, ev, value);
        } else {
          try {
            const obj = value ? JSON.parse(value) : {};
            onChange?.(obj, ev, value);
          } catch (error) {
            onParseError?.(error as Error, value, ev);
          }
        }
      }}
    />
  );
};

export interface JSONEditorProps extends Omit<EditorProps, 'value' | 'onChange' | 'language' | 'options'> {
  value?: string | object;
  valueType?: 'string' | 'object';
  options?: Omit<editor.IStandaloneEditorConstructionOptions, 'language'>;
  onChange?: (value: string | object | undefined, ev: editor.IModelContentChangedEvent, str?: string) => void;
  onParseError?: (error: Error, str: string | undefined, ev: editor.IModelContentChangedEvent,) => void;
}

export type JSONViewerProps = Omit<JSONEditorProps, 'onChange' | 'onParseError' | 'options'> & {
  options?: Omit<editor.IStandaloneEditorConstructionOptions, 'language' | 'readOnly'>;
}

export const JSONViewer = (props: JSONViewerProps) => {
  const { options, ...rest } = props;

  return <JSONEditor options={{ ...options, readOnly: true }} {...rest} />;
};
