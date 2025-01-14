import { Schema, SchemaKey } from '@formily/react';
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
  return !isBlank(schema.properties) || (decorator && decorator !== componentName) || (component && component !== componentName);
};

const propCompile = (prop: IAny, scope?: IAnyObject) => {
  if (typeof prop === 'string') {
    const value = prop.trim();
    if (value.startsWith('{{') && value.endsWith('}}')) {
      return Schema.compile(value, scope);
    }
  }
  return prop;
};

// 判断是否需要渲染
export const isItemSchemaVisible = (schema: Schema, scope?: IAnyObject) => {
  const hidden = schema['x-hidden'];
  if (hidden === true || propCompile(hidden, scope) === true) {
    return false;
  }

  const visible = schema['x-visible'];
  if (visible === false || propCompile(visible, scope) === false) {
    return false;
  }
  const display = schema['x-display'];
  if (display && propCompile(display, scope) !== 'visible') {
    return false;
  }
  return true;
};


export const schemaItemsReduce = (schema: Schema, scope: IAnyObject, toProps: (itemSchema: Schema, key: SchemaKey, index: number) => IAnyObject) => {
  if (!schema) {
    return undefined;
  }
  const { items } = schema;
  if (isBlank(items)) {
    return undefined;
  }
  // 取第一个 item 来实在相关组件 具体 index 渲染时 可考虑根据为数组的 items[index] 中一样 prop 来渲染
  const item = Array.isArray(items) ? items[0] : items;
  const propsArr: IAny[] = [];

  item?.reduceProperties((arr, item, key, index) => {
    if (!isItemSchemaVisible(item, scope)) {
      return arr;
    }
    arr.push(toProps(item, key, index));
    return arr;
  }, propsArr);

  return propsArr;
};
