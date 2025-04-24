import { useExpressionScope, useFieldSchema } from '@formily/react';
import { getSmart, IAny, IAnyObject, normalizeToArray } from '@yimoka/shared';
import React, { useMemo } from 'react';

import { SchemaItemRender } from '../components/array/schema-item-render';
import { RenderAny } from '../components/render-any';
import { getPropsByItemSchema, getSchemaNameByFieldSchema, isItemSchemaRecursion, isItemSchemaVisible } from '../tools/schema-items';

// https://docs.qq.com/doc/DSG9ZbFBEQ0xLeUtk
export const useSchemaItemsToItems = <T = IAny>(data?: IAny[] | IAny, propsMap?: IAnyObject, valueNodeKey = 'children') => {
  const fieldSchema = useFieldSchema();
  const scope = useExpressionScope();

  return useMemo(() => {
    const itemComponentName = 'Item';
    const componentItems: T[] = [];
    const { items: fieldItems } = fieldSchema ?? {};
    if (!data || !fieldItems) {
      return componentItems;
    }
    const arr = Array.isArray(data) ? data : [data];
    // eslint-disable-next-line complexity
    normalizeToArray(arr).forEach((record: IAny, index: number) => {
      const itemSchema = Array.isArray(fieldItems) ? (fieldItems[index]) : fieldItems;
      if (!itemSchema || !isItemSchemaVisible(itemSchema, { ...scope, $index: index, $record: record })) {
        return;
      }
      const schemaKey = Array.isArray(data) ? undefined : getSchemaNameByFieldSchema(itemSchema, fieldSchema);

      const getRecordIndex = () => index;
      const { 'x-component': component, 'x-decorator': decorator, properties } = itemSchema;
      if (
        !properties // 没有 properties 时直接使用 itemSchema
        || (component) // 顶层 UI 属性不为空时使用 itemSchema
        || (!component && decorator === itemComponentName) // 顶层 decorator 为 itemComponentName 时并且 component 为空时使用 itemSchema
      ) {
        const itemProps = getPropsByItemSchema(itemSchema, itemComponentName, propsMap);
        if (isItemSchemaRecursion(itemSchema, itemComponentName)) {
          itemProps[valueNodeKey] = (
            <SchemaItemRender
              componentName={itemComponentName}
              getRecordIndex={getRecordIndex}
              name={schemaKey}
              record={record}
              schema={itemSchema}
              value={record}
            />
          );
        } else if (typeof itemProps[valueNodeKey] === 'undefined') {
          itemProps[valueNodeKey] = <RenderAny value={record} />;
        }
        componentItems.push(itemProps);
      } else {
        // 当顶层没有 UI 属性或者 UI 不为 itemComponentName 且 properties 不为空时使用 properties 的每一个 prop 转为 item
        Object.entries(properties).forEach(([propKey, propSchema]) => {
          const key = propSchema.name ?? propKey;
          const value = getSmart(record, key);

          if (!isItemSchemaVisible(propSchema, { ...scope, $index: index, $record: record, $value: value })) {
            return;
          }
          const schemaKey = Array.isArray(data) ? undefined : getSchemaNameByFieldSchema(propSchema, fieldSchema);
          const itemProps = getPropsByItemSchema(propSchema, itemComponentName, propsMap);
          if (isItemSchemaRecursion(propSchema, itemComponentName)) {
            itemProps[valueNodeKey] = (
              <SchemaItemRender
                componentName={itemComponentName}
                getRecordIndex={getRecordIndex}
                name={schemaKey}
                record={record}
                schema={propSchema}
                value={value}
              />
            );
          } else if (typeof itemProps[valueNodeKey] === 'undefined') {
            itemProps[valueNodeKey] = <RenderAny value={value} />;
          }
          componentItems.push(itemProps);
        });
      }
    });

    return componentItems;
  }, [fieldSchema, data, scope, propsMap, valueNodeKey]);
};
