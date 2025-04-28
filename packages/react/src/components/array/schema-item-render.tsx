/**
 * @description Schema 项渲染组件，用于处理数组项的渲染逻辑
 */

import { Schema, SchemaKey } from '@formily/json-schema';
import { RecordScope, ExpressionScope, useFieldSchema } from '@formily/react';
import { IAny, isVacuous } from '@yimoka/shared';
import React, { useMemo } from 'react';

import { IRecordIndexFn } from '../../hooks/record-index-fn';
import { getSchemaNameByFieldSchema } from '../../tools/schema-items';

import { SchemaItemRecursion } from './schema-item-recursion';

/**
 * Schema 项渲染组件
 * @summary 用于渲染数组中的单个项，处理项的名称生成和作用域设置
 *
 * @param {Object} props - 组件属性
 * @param {IAny} props.value - 当前项的值
 * @param {IAny} props.record - 当前记录对象
 * @param {Schema} props.schema - Schema 定义
 * @param {SchemaKey} [props.name] - 可选的项名称
 * @param {IRecordIndexFn} [props.getRecordIndex] - 获取记录索引的函数
 * @param {string} [props.componentName] - 组件名称
 *
 * @returns {React.ReactElement} 渲染后的 React 元素
 *
 * @remarks
 * 该组件主要负责：
 * 1. 生成数组项的唯一名称
 * 2. 设置记录作用域和表达式作用域
 * 3. 递归渲染 Schema 项
 *
 * @example
 * ```tsx
 * <SchemaItemRender
 *   value={itemValue}
 *   record={record}
 *   schema={schema}
 *   getRecordIndex={getIndex}
 * />
 * ```
 */
export const SchemaItemRender = (props: { value: IAny, record: IAny, schema: Schema, name?: SchemaKey, getRecordIndex?: IRecordIndexFn, componentName?: string }) => {
  const { value, record, schema, getRecordIndex, componentName, name } = props;
  const index = getRecordIndex?.(record);
  const fieldSchema = useFieldSchema();
  const curName = useMemo(() => {
    if (name) {
      return name;
    }
    const schemaName = getSchemaNameByFieldSchema(schema, fieldSchema);
    if (!isVacuous(schemaName)) {
      return `${index}.${schemaName}`;
    }
    // 如果找不到相对的 schemaName 并且 schema 是 void,如果不添加 name 会导致同一个数组项的所有 key 都是同一个 会导致渲染的结果都是每一个, 以支持正确渲染
    // 这里只是一种兼容方式 正常是建议在 item 里声明 type 为非 void 来获取相对的值
    if (schema.type === 'void') {
      return `${index}.${schema.name}`;
    }
    // 如果不转为字符串 0 会出现问题
    return `${index}`;
  }, [name, index, schema, fieldSchema]);

  return (
    <RecordScope getIndex={() => index ?? 0} getRecord={() => record} >
      <ExpressionScope value={{ $value: value }}>
        <SchemaItemRecursion componentName={componentName} name={curName} schema={schema} />
      </ExpressionScope>
    </RecordScope>
  );
};
