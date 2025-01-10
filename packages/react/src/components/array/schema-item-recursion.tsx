import { isVoidField } from '@formily/core';
import { Schema, SchemaKey } from '@formily/json-schema';
import { useField, RecursionField } from '@formily/react';
import React, { useMemo } from 'react';

export const SchemaItemRecursion = (props: { schema: Schema, componentName?: string, name?: SchemaKey }) => {
  const { schema, componentName, name } = props;
  const field = useField();
  const voidField = isVoidField(field);

  const curSchema = useMemo(() => {
    // 渲染有两种情况
    // 一种是用来编辑的 dataSources 和 form 中的值 同值 这时候标准的迭代渲染即可
    // 一种是用来展示的 dataSources 并不存在于 form values 中 dataSources 只是展示用的 要显示声明字段为 void
    // 情况 2 中其实只要 item 里面也声明 type: void 就可以了,但有点违反直觉，所以这里做了特殊处理
    const tmpSchema = voidField && schema.type !== 'void' ? { type: 'void', ...schema } : schema;
    const { type, 'x-decorator': decorator, 'x-decorator-props': decoratorProps, ...rest } = tmpSchema;
    return decorator === componentName ? { type: 'void', ...rest } : tmpSchema;
  }, [componentName, schema, voidField]);

  if (componentName && componentName === schema['x-component']) {
    return <RecursionField schema={curSchema} onlyRenderProperties name={name} />;
  }
  return <RecursionField schema={curSchema} name={name} />;
};
