/**
 * @description Schema 项递归渲染组件，用于处理 Schema 的递归渲染逻辑
 */

import { isVoidField } from '@formily/core';
import { Schema, SchemaKey } from '@formily/json-schema';
import { useField, RecursionField, useFieldSchema } from '@formily/react';
import React, { useMemo } from 'react';

import { getSchemaNameByFieldSchema } from '../../tools/schema-items';

/**
 * Schema 项递归渲染组件
 * @summary 用于处理 Schema 的递归渲染，支持编辑和展示两种模式
 * @param {Object} props - 组件属性
 * @param {Schema} props.schema - 当前需要渲染的 Schema 对象
 * @param {string} [props.componentName] - 组件名称，用于取 item 项的属性
 * @param {SchemaKey} [props.name] - Schema 的键名
 * @returns {React.ReactNode} 渲染后的 React 节点
 * @remarks
 * 该组件主要处理两种渲染场景：
 * 1. 编辑模式：dataSources 和 form 中的值相同，使用标准迭代渲染
 * 2. 展示模式：dataSources 仅用于展示，不存在于 form values 中，需要声明为 void 字段
 */
export const SchemaItemRecursion = (props: { schema: Schema, componentName?: string, name?: SchemaKey }) => {
  const { schema, componentName, name } = props;
  const field = useField();
  const voidField = isVoidField(field);
  const fieldSchema = useFieldSchema();
  // 获取当前 Schema 的名称，优先使用传入的 name，否则从 Schema 中获取
  const curName = useMemo(() => (name ? name : getSchemaNameByFieldSchema(schema, fieldSchema)), [name, schema, fieldSchema]);

  const curSchema = useMemo(() => {
    // 处理 Schema 的特殊情况：
    // 1. 如果是 void 字段但 schema 类型不是 void，则转换为 void 类型
    // 2. 如果装饰器名称与组件名称相同，则转换为 void 类型
    const tmpSchema = voidField && schema.type !== 'void' ? { type: 'void', ...schema } : schema;
    const { type, 'x-decorator': decorator, 'x-decorator-props': decoratorProps, ...rest } = tmpSchema;
    return decorator === componentName ? { type: 'void', ...rest } : tmpSchema;
  }, [componentName, schema, voidField]);

  // 特殊处理：当组件名称与 Schema 的组件名称相同时，只渲染属性
  if (componentName && componentName === schema['x-component']) {
    return <RecursionField onlyRenderProperties name={name} schema={curSchema} />;
  }
  return <RecursionField name={curName} schema={curSchema} />;
};
