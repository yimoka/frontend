import { Schema, useFieldSchema } from '@formily/react';
import { IAny, IAnyObject } from '@yimoka/shared';
import React, { useMemo } from 'react';

import { SchemaItemRender } from '../components/array/schema-item-render';
import { getPropsByItemSchema, isItemSchemaRecursion, schemaItemsReduce } from '../tools/schema-items';

import { IRecordIndexFn } from './record-index-fn';

export const useSchemaItemsToColumns = (getRecordIndex: IRecordIndexFn, propsMap?: IAnyObject) => {
  const fieldSchema = useFieldSchema();
  return useMemo(() => schemaItemsReduce(fieldSchema, item => schemaToItemProps(item, getRecordIndex, propsMap)), [fieldSchema, getRecordIndex, propsMap]);
};

const schemaToItemProps = (schema: Schema, getRecordIndex?: IRecordIndexFn, propsMap?: IAnyObject) => {
  const itemComponentName = 'Column';
  const itemProps = getPropsByItemSchema(schema, itemComponentName, propsMap);
  // 如果有 items 则不渲染 properties
  if (schema.items) {
    itemProps.children = schemaItemsReduce(schema, item => schemaToItemProps(item, getRecordIndex, propsMap));
    return itemProps;
  }
  if (isItemSchemaRecursion(schema, itemComponentName)) {
    itemProps.render = (value: IAny, record: IAny) => (
      <SchemaItemRender
        value={value}
        record={record}
        schema={schema}
        getRecordIndex={getRecordIndex}
        componentName={itemComponentName}
      />
    );
  }
  return itemProps;
};

