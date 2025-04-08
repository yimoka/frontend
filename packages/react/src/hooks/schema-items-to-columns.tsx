import { Schema, useExpressionScope, useFieldSchema } from '@formily/react';
import { IAny, IAnyObject } from '@yimoka/shared';
import React, { useMemo } from 'react';

import { SchemaItemRender } from '../components/array/schema-item-render';
import { getPropsByItemSchema, isItemSchemaRecursion, isItemSchemaVisible, schemaItemsReduce } from '../tools/schema-items';

import { IRecordIndexFn } from './record-index-fn';

export const useSchemaItemsToColumns = (getRecordIndex: IRecordIndexFn, propsMap?: IAnyObject) => {
  const fieldSchema = useFieldSchema();
  const scope = useExpressionScope();
  return useMemo(() => schemaItemsReduce(fieldSchema, scope, item => schemaToItemProps(item, scope, getRecordIndex, propsMap)), [fieldSchema, getRecordIndex, propsMap, scope]);
};

const schemaToItemProps = (schema: Schema, scope: IAnyObject, getRecordIndex?: IRecordIndexFn, propsMap?: IAnyObject) => {
  const itemComponentName = 'Column';
  const itemProps = getPropsByItemSchema(schema, itemComponentName, propsMap, scope);
  // 如果组件名称等于 ColumnGroup 等 将 schema 的 properties 转换为 children
  if (schema['x-component'] === 'ColumnGroup') {
    itemProps.children = [];
    schema.reduceProperties((arr, schema) => {
      if (!isItemSchemaVisible(schema, scope)) {
        return arr;
      }
      arr.push(schemaToItemProps(schema, scope, getRecordIndex, propsMap));
      return arr;
    }, itemProps.children);
    return itemProps;
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
