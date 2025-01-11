import { useFieldSchema } from '@formily/react';
import { IAny, IAnyObject, isBlank, normalizeToArray } from '@yimoka/shared';
import { get } from 'lodash-es';
import React, { useMemo } from 'react';

import { SchemaItemRender } from '../components/array/schema-item-render';
import { RenderAny } from '../components/render-any';
import { getPropsByItemSchema, isItemSchemaRecursion, isItemSchemaVisible } from '../tools/schema-items';

// https://docs.qq.com/doc/DSG9ZbFBEQ0xLeUtk
export const useSchemaItemsToItems = <T = IAny>(data?: IAny[] | IAny, propsMap?: IAnyObject, valueNodeKey = 'children') => {
  const fieldSchema = useFieldSchema();

  return useMemo(() => {
    const itemComponentName = 'Item';
    const componentItems: T[] = [];
    const { items: fieldItems } = fieldSchema ?? {};
    if (isBlank(data) || isBlank(fieldItems)) {
      return componentItems;
    }
    normalizeToArray(data).forEach((record, index) => {
      const itemSchema = Array.isArray(fieldItems) ? (fieldItems[index]) : fieldItems;
      if (isBlank(itemSchema) || !isItemSchemaVisible(itemSchema)) {
        return;
      }
      const getRecordIndex = () => index;
      // 当顶层不包含 UI 属性或者 UI属性为 itemComponentName 或者 properties 为空时 则转为 component item
      const { 'x-component': component, 'x-decorator': decorator, properties } = itemSchema;
      if (isBlank(properties) || (!(!component || component === itemComponentName) && (!decorator || decorator === itemComponentName))) {
        const itemProps = getPropsByItemSchema(itemSchema, itemComponentName, propsMap);
        if (isItemSchemaRecursion(itemSchema, itemComponentName)) {
          itemProps[valueNodeKey] = <SchemaItemRender value={record} record={record} schema={itemSchema} componentName={itemComponentName} getRecordIndex={getRecordIndex} />;
        } else {
          itemProps[valueNodeKey] = <RenderAny value={record} />;
        }
        return componentItems.push(itemProps);
      }
      // 当顶层没有 UI 属性且 properties 不为空时使用 properties 的每一个 prop 转为 item
      Object.entries(properties).forEach(([propKey, propSchema]) => {
        if (!isItemSchemaVisible(propSchema)) {
          return;
        }
        const value = get(record, propSchema.name ?? propKey);
        const itemProps = getPropsByItemSchema(propSchema, itemComponentName, propsMap);
        if (isItemSchemaRecursion(propSchema, itemComponentName)) {
          itemProps[valueNodeKey] = <SchemaItemRender value={value} record={record} schema={propSchema} componentName={itemComponentName} getRecordIndex={getRecordIndex} />;
        } else if (typeof itemProps[valueNodeKey] === 'undefined') {
          itemProps[valueNodeKey] = <RenderAny value={value} />;
        }
        componentItems.push(itemProps);
      });
    });

    return componentItems;
  }, [fieldSchema, data, propsMap, valueNodeKey]);
};
