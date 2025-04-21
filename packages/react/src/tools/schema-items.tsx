/**
 * @file schema-items.tsx
 * @remarks Schema 相关工具函数，提供对 Formily Schema 的处理能力
 * @author yimoka development team
 * @module @yimoka/react
 */

import { Schema, SchemaKey } from '@formily/react';
import { IAny, IAnyObject, isVacuous } from '@yimoka/shared';
import { get } from 'lodash-es';

/**
 * 根据 Schema 获取组件属性
 * @param schema - Schema 对象
 * @param componentName - 组件名称
 * @param propsMap - 属性映射对象，键为组件属性名，值为 schema 属性路径
 * @returns 组件属性对象
 * @remarks 从 Schema 中提取组件所需的属性，支持从 x-decorator-props 和 x-component-props 中合并属性
 */

// eslint-disable-next-line complexity
export const getPropsByItemSchema = (schema: Schema, componentName?: string, propsMap?: IAnyObject, scope?: IAnyObject) => {
  let itemProps: IAnyObject = {};
  if (!isVacuous(propsMap)) {
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
  const sName = schema.name;
  if (componentName === 'Column' && sName) {
    // TODO: 处理层级
    const fieldColumnProps = scope?.$config?.fieldsConfig?.[sName]?.['x-column'];
    if (!isVacuous(fieldColumnProps)) {
      itemProps = { ...fieldColumnProps, ...itemProps };
    }
  }
  return itemProps;
};

/**
 * 判断 Schema 是否需要递归处理
 * @param schema - Schema 对象
 * @param componentName - 组件名称
 * @returns 是否需要递归处理
 * @remarks 当 Schema 含有子属性或使用了不同的装饰器/组件时需要递归处理
 */
export const isItemSchemaRecursion = (schema: Schema, componentName?: string) => {
  const decorator = schema['x-decorator'];
  const component = schema['x-component'];
  return !isVacuous(schema.properties) || (decorator && decorator !== componentName) || (component && component !== componentName);
};

/**
 * 编译 Schema 中的表达式属性
 * @param prop - 属性值
 * @param scope - 表达式执行的作用域对象
 * @returns 编译后的属性值
 * @remarks 支持 {{expression}} 格式的表达式编译
 */
const propCompile = (prop: IAny, scope?: IAnyObject) => {
  if (typeof prop === 'string') {
    const value = prop.trim();
    if (value.startsWith('{{') && value.endsWith('}}')) {
      return Schema.shallowCompile(value, scope);
    }
  }
  return prop;
};

/**
 * 判断 Schema 是否需要渲染
 * @param schema - Schema 对象
 * @param scope - 表达式执行的作用域对象
 * @returns 是否需要渲染
 * @remarks 根据 x-hidden、x-visible 和 x-display 属性判断 Schema 是否需要渲染
 */
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

/**
 * 处理 Schema 的 items 属性，将其转换为组件属性数组
 * @param schema - Schema 对象
 * @param scope - 表达式执行的作用域对象
 * @param toProps - 将 Schema 转换为组件属性的函数
 * @returns 组件属性数组
 * @remarks 处理 Schema 的 items 属性，过滤不可见的项，并转换为组件需要的属性数组
 */
export const schemaItemsReduce = (schema: Schema, scope: IAnyObject, toProps: (itemSchema: Schema, key: SchemaKey, index: number) => IAnyObject) => {
  if (!schema) {
    return undefined;
  }
  const { items } = schema;
  if (isVacuous(items)) {
    return undefined;
  }
  // 取第一个 item 来实例化相关组件，具体 index 渲染时可考虑根据数组的 items[index] 中相同的 prop 来渲染
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

/**
 * 根据字段 Schema 获取当前 Schema 的完整名称
 * @param schema - 当前 Schema 对象
 * @param fieldSchema - 字段 Schema 对象
 * @param name - 当前累积的名称
 * @returns Schema 的完整字段名称
 * @remarks 递归向上查找父 Schema，构建完整的字段路径名称
 */
export const getSchemaNameByFieldSchema = (schema: Schema, fieldSchema: Schema, name?: SchemaKey): SchemaKey | undefined => {
  const schemaName = schema.type === 'void' ? undefined : schema.name;
  if (!schema?.parent || schema.parent === fieldSchema) {
    let rName = schemaName;
    if (rName && name) {
      rName = `${rName}.${name}`;
    }
    return rName;
  }
  if (!schemaName) {
    return getSchemaNameByFieldSchema(schema.parent, fieldSchema, name);
  }
  if (!name) {
    return getSchemaNameByFieldSchema(schema.parent, fieldSchema, schemaName);
  }
  return getSchemaNameByFieldSchema(schema.parent, fieldSchema, `${schemaName}.${name}`);
};
