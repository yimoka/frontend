import { Schema, useExpressionScope, useFieldSchema } from '@formily/react';
import { IAny, IAnyObject, isVacuous, mergeWithArrayOverride } from '@yimoka/shared';
import { getFieldConfig } from '@yimoka/store';
import React, { useMemo } from 'react';

import { SchemaItemRender } from '../components/array/schema-item-render';
import { getPropsByItemSchema, getSchemaNameByFieldSchema, isItemSchemaRecursion, isItemSchemaVisible, schemaItemsReduce } from '../tools/schema-items';

import { IRecordIndexFn } from './record-index-fn';

/**
 * 将 Schema 配置转换为表格列配置的 Hook
 * @param getRecordIndex - 获取记录索引的函数
 * @param propsMap - 可选的属性映射对象，用于装 schema 的属性转换为列属性
 * @returns 转换后的列配置数组
 */
export const useSchemaItemsToColumns = (getRecordIndex: IRecordIndexFn, propsMap?: IAnyObject) => {
  const fieldSchema = useFieldSchema();
  const scope = useExpressionScope();
  return useMemo(() => schemaItemsReduce(fieldSchema, scope, item => schemaToItemProps(item, fieldSchema, scope, getRecordIndex, propsMap)), [fieldSchema, getRecordIndex, propsMap, scope]);
};

/**
 * 将单个 Schema 配置转换为列属性配置
 * @param schema - 当前处理的 Schema 配置
 * @param fieldSchema - 父级 Schema 配置
 * @param scope - 表达式作用域
 * @param getRecordIndex - 获取记录索引的函数
 * @param propsMap - 可选的属性映射对象
 * @returns 转换后的列属性配置
 */
const schemaToItemProps = (schema: Schema, fieldSchema: Schema, scope: IAnyObject, getRecordIndex?: IRecordIndexFn, propsMap?: IAnyObject) => {
  const itemComponentName = 'Column';
  let itemProps = getPropsByItemSchema(schema, itemComponentName, propsMap);

  // 处理列组（ColumnGroup）的情况
  if (schema['x-component'] === 'ColumnGroup') {
    itemProps.children = [];
    // 递归处理列组中的每个子列
    schema.reduceProperties((arr, schema) => {
      if (!isItemSchemaVisible(schema, scope)) {
        return arr;
      }
      arr.push(schemaToItemProps(schema, fieldSchema, scope, getRecordIndex, propsMap));
      return arr;
    }, itemProps.children);
    return itemProps;
  }

  // 获取字段配置中的列相关配置
  let schemaName = getSchemaNameByFieldSchema(schema, fieldSchema);
  if (!schemaName) {
    schemaName = schema.name;
  }
  if (schemaName) {
    const fieldConfig = getFieldConfig(schemaName, scope.$config?.fieldsConfig);
    const xColumn = fieldConfig?.['x-column'];
    // 合并字段配置中的列配置
    if (!isVacuous(xColumn)) {
      itemProps = mergeWithArrayOverride({}, xColumn, itemProps);
    }
  }

  // 处理递归渲染的情况
  if (isItemSchemaRecursion(schema, itemComponentName)) {
    itemProps.render = (value: IAny, record: IAny) => (
      <SchemaItemRender
        componentName={itemComponentName}
        getRecordIndex={getRecordIndex}
        record={record}
        schema={schema}
        value={value}
      />
    );
  }
  return itemProps;
};
