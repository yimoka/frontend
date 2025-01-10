import { Schema } from '@formily/react';
import { IAny, IAnyObject, isBlank } from '@yimoka/shared';
import { get } from 'lodash-es';

export const getPropsByItemSchema = (schema: Schema, componentName?: string, propsMap?: IAnyObject) => {
  let itemProps: IAnyObject = {};
  if (!isBlank(propsMap)) {
    Object.entries(propsMap).forEach(([itemKey, schemaKey]) => {
      const val = get(schema, schemaKey);
      if (typeof val !== 'undefined') {
        itemProps[itemKey] = val;
      }
    });
  }
  const decorator = schema['x-decorator'];
  const component = schema['x-component'];
  if (decorator === componentName) {
    itemProps = { ...itemProps, ...schema['x-decorator-props'] };
  }
  if (component === componentName) {
    itemProps = { ...itemProps, ...schema['x-component-props'] };
  }
  return itemProps;
};

export const isItemSchemaRecursion = (schema: Schema, componentName?: string) => {
  const decorator = schema['x-decorator'];
  const component = schema['x-component'];
  return schema.properties || (decorator && decorator !== componentName) || (component && component !== componentName);
};

// 判断是否需要渲染
export const isItemSchemaVisible = (schema: Schema) => !(schema['x-hidden'] || schema['x-visible'] === false || (schema['x-display'] && schema['x-display'] !== 'visible'));

export const schemaItemsReduce = (schema: Schema, toProps: (itemSchema: Schema) => IAnyObject) => {
  const { items } = schema;
  if (isBlank(items)) {
    return undefined;
  }
  // 取第一个 item 来实在相关组件 具体 index 渲染时 可考虑根据为数组的 items[index] 中一样 prop 来渲染
  const item = Array.isArray(items) ? items[0] : items;
  const propsArr: IAny[] = [];

  item?.reduceProperties((arr, item) => {
    if (!isItemSchemaVisible(item)) {
      return arr;
    }
    arr.push(toProps(item));
    return arr;
  }, propsArr);

  return propsArr;
};
