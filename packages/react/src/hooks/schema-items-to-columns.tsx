import { Schema, useExpressionScope, useFieldSchema } from '@formily/react';
import { IAny, IAnyObject, isVacuous, mergeWithArrayOverride } from '@yimoka/shared';
import { getFieldConfig } from '@yimoka/store';
import React, { useMemo } from 'react';

import { SchemaItemRender } from '../components/array/schema-item-render';
import { getPropsByItemSchema, getSchemaNameByFieldSchema, isItemSchemaRecursion, isItemSchemaVisible, schemaItemsReduce } from '../tools/schema-items';

import { IRecordIndexFn } from './record-index-fn';

export const useSchemaItemsToColumns = (getRecordIndex: IRecordIndexFn, propsMap?: IAnyObject) => {
  const fieldSchema = useFieldSchema();
  const scope = useExpressionScope();
  return useMemo(() => schemaItemsReduce(fieldSchema, scope, item => schemaToItemProps(item, fieldSchema, scope, getRecordIndex, propsMap)), [fieldSchema, getRecordIndex, propsMap, scope]);
};

const schemaToItemProps = (schema: Schema, fieldSchema: Schema, scope: IAnyObject, getRecordIndex?: IRecordIndexFn, propsMap?: IAnyObject) => {
  const itemComponentName = 'Column';
  let itemProps = getPropsByItemSchema(schema, itemComponentName, propsMap);
  // 如果组件名称等于 ColumnGroup 等 将 schema 的 properties 转换为 children
  if (schema['x-component'] === 'ColumnGroup') {
    itemProps.children = [];
    schema.reduceProperties((arr, schema) => {
      if (!isItemSchemaVisible(schema, scope)) {
        return arr;
      }
      arr.push(schemaToItemProps(schema, fieldSchema, scope, getRecordIndex, propsMap));
      return arr;
    }, itemProps.children);
    return itemProps;
  }
  // 获取 schemaName 以便取 fieldConfig 中的 'x-column' 配置
  let schemaName = getSchemaNameByFieldSchema(schema, fieldSchema);
  if (!schemaName) {
    schemaName = schema.name;
  }
  if (schemaName) {
    const fieldConfig = getFieldConfig(schemaName, scope.$config?.fieldsConfig);
    const xColumn = fieldConfig?.['x-column'];
    if (!isVacuous(xColumn)) {
      itemProps = mergeWithArrayOverride({}, xColumn, itemProps);
    }
  }

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
