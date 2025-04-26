import { SchemaKey, useExpressionScope, useFieldSchema } from '@formily/react';
import { getSmart, IAny, IAnyObject, isVacuous, normalizeToArray } from '@yimoka/shared';
import { getFieldConfig } from '@yimoka/store';
import React, { useMemo } from 'react';

import { SchemaItemRender } from '../components/array/schema-item-render';
import { RenderAny } from '../components/render-any';
import { getPropsByItemSchema, getSchemaNameByFieldSchema, isItemSchemaRecursion, isItemSchemaVisible } from '../tools/schema-items';


const withTitle = (itemProps: IAnyObject, schemaName?: SchemaKey, scope?: IAnyObject, propsMap?: IAnyObject) => {
  if (schemaName && propsMap) {
    const field = Object.keys(propsMap).find(item => propsMap[item] === 'title');
    if (field && typeof itemProps[field] === 'undefined' && scope) {
      const fieldConfig = getFieldConfig(schemaName, scope.$store?.fieldsConfig ?? scope.$config?.fieldsConfig);
      if (!isVacuous(fieldConfig)) {
        const newProps = itemProps;
        newProps[field] = fieldConfig.title;
        return newProps;
      }
    }
  }
  return itemProps;
};

/**
 * 将 Schema items 转换为组件 items 的 Hook
 * @param data - 数据源，可以是数组或单个对象
 * @param propsMap - 属性映射对象，用于自定义属性转换
 * @param valueNodeKey - 值节点的 key，默认为 'children'
 * @returns 转换后的组件项数组
 */
export const useSchemaItemsToItems = <T = IAny>(data?: IAny[] | IAny, propsMap?: IAnyObject, valueNodeKey = 'children') => {
  // 获取当前字段的 Schema 和表达式作用域
  const fieldSchema = useFieldSchema();
  const scope = useExpressionScope();

  return useMemo(() => {
    const itemComponentName = 'Item';
    const componentItems: T[] = [];
    const { items: fieldItems } = fieldSchema ?? {};

    // 如果没有数据或字段项，返回空数组
    if (!data || !fieldItems) {
      return componentItems;
    }

    // 将数据转换为数组形式
    const arr = Array.isArray(data) ? data : [data];

    // 遍历数据数组，为每个数据项生成对应的组件项
    // eslint-disable-next-line complexity
    normalizeToArray(arr).forEach((record: IAny, index: number) => {
      // 获取当前索引对应的 Schema 项
      const itemSchema = Array.isArray(fieldItems) ? (fieldItems[index]) : fieldItems;
      // 检查 Schema 项是否可见
      if (!itemSchema || !isItemSchemaVisible(itemSchema, { ...scope, $index: index, $record: record })) {
        return;
      }

      // 获取 Schema 的键名
      const schemaKey = Array.isArray(data) ? undefined : getSchemaNameByFieldSchema(itemSchema, fieldSchema);

      const getRecordIndex = () => index;
      const { 'x-component': component, 'x-decorator': decorator, properties } = itemSchema;

      // 处理没有 properties 或顶层有 UI 属性的情况
      if (
        !properties // 没有 properties 时直接使用 itemSchema
        || (component) // 顶层 UI 属性不为空时使用 itemSchema
        || (!component && decorator === itemComponentName) // 顶层 decorator 为 itemComponentName 且 component 为空时使用 itemSchema
      ) {
        // 获取组件属性
        const itemProps = getPropsByItemSchema(itemSchema, itemComponentName, propsMap);

        // 处理递归 Schema 的情况
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
          // 如果没有设置值节点，使用 RenderAny 渲染值
          itemProps[valueNodeKey] = <RenderAny value={record} />;
        }
        componentItems.push(withTitle(itemProps, schemaKey, scope, propsMap));
      } else {
        // 处理 properties 中的每个属性，将它们转换为组件项
        Object.entries(properties).forEach(([propKey, propSchema]) => {
          const key = propSchema.name ?? propKey;
          const value = getSmart(record, key);

          // 检查属性 Schema 是否可见
          if (!isItemSchemaVisible(propSchema, { ...scope, $index: index, $record: record, $value: value })) {
            return;
          }

          const schemaKey = Array.isArray(data) ? undefined : getSchemaNameByFieldSchema(propSchema, fieldSchema);
          const itemProps = getPropsByItemSchema(propSchema, itemComponentName, propsMap);

          // 处理递归 Schema 的情况
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
            // 如果没有设置值节点，使用 RenderAny 渲染值
            itemProps[valueNodeKey] = <RenderAny value={value} />;
          }
          componentItems.push(withTitle(itemProps, key, scope, propsMap));
        });
      }
    });

    return componentItems;
  }, [fieldSchema, data, scope, propsMap, valueNodeKey]);
};
