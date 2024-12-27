import { ISchema } from '@formily/json-schema';
import { IAny, IAnyObject, IObjKey, IStrKeyObject, JSONParse, JSONStringify } from '@yimoka/shared';

import { BaseStore } from './base';

/**
 * 将给定的值转换为搜索参数字符串。
 *
 * @param value - 需要转换的值，可以是任意类型。
 * @returns 如果值是对象，则返回其 JSON 字符串表示；否则返回值的字符串表示。如果值为 `null` 或 `undefined`，则返回空字符串。
 *
 * @example
 * ```typescript
 * valueToSearchParam({ key: 'value' });
 * // 返回: '{"key":"value"}'
 *
 * valueToSearchParam(123);
 * // 返回: '123'
 *
 * valueToSearchParam('hello');
 * // 返回: 'hello'
 *
 * valueToSearchParam(null);
 * // 返回: ''
 *
 * valueToSearchParam(undefined);
 * // 返回: ''
 * ```
 */
export const valueToSearchParam = (value: IAny) => (typeof value === 'object' ? JSONStringify(value) : value?.toString?.() ?? '');


/**
 * 解析查询参数，根据提供的模式(schema)和默认值(dfValue)将查询参数转换为相应类型的值。
 *
 * @param {string} [searchParam] - 要解析的查询参数。
 * @param {ISchema} [schema={}] - 定义查询参数类型的模式对象。
 * @param {IAny} [dfValue=''] - 默认值，用于推断类型。
 * @returns {IAny} 解析后的查询参数值。
 *
 * @example
 * 示例1：解析数字类型的查询参数
 * ```typescript
 * const result1 = parseSearchParam('123', { type: 'number' });
 * console.log(result1); // 输出: 123
 * ```
 *
 * @example
 * 示例2：解析布尔类型的查询参数
 * ```typescript
 * const result2 = parseSearchParam('true', { type: 'boolean' });
 * console.log(result2); // 输出: true
 * ```
 *
 * @example
 * 示例3：解析对象类型的查询参数
 * ```typescript
 * const result3 = parseSearchParam('{"key":"value"}', { type: 'object' });
 * console.log(result3); // 输出: { key: 'value' }
 * ```
 *
 * @example
 * 示例4：解析数组类型的查询参数
 * ```typescript
 * const result4 = parseSearchParam('[1,2,3]', { type: 'array' });
 * console.log(result4); // 输出: [1, 2, 3]
 * ```
 *
 * @example
 * 示例5：解析无效类型的查询参数，返回原始字符串
 * ```typescript
 * const result5 = parseSearchParam('invalid', { type: 'unknown' });
 * console.log(result5); // 输出: 'invalid'
 * ```
 */
export const parseSearchParam = (searchParam?: string, schema: ISchema = {}, dfValue: IAny = '') => {
  const { type = Array.isArray(dfValue) ? 'array' : typeof dfValue } = schema;
  if (typeof searchParam !== 'string') {
    return searchParam;
  }
  const typeFnMap: Record<string, (value: string) => IAny> = {
    number: (value: string) => Number(value),
    bigint: (value: string) => BigInt(value),
    boolean: (value: string) => value === 'true',
    object: (value: string) => JSONParse(value),
    array: (value: string) => {
      const arr = JSONParse(value, []);
      return Array.isArray(arr) ? arr : [];
    },
    void: () => undefined,
  };
  const typeFn = typeFnMap[type];
  return typeFn ? typeFn(searchParam) : searchParam;
};

/**
 * 获取字段的分隔符，如果字段是字符串类型且有分隔符，则视为可分割为数组的字符串。
 *
 * @param field - 字段名
 * @param store - 基础存储对象。
 * @returns 字段配置中的分隔符字符串，如果不存在则返回 `undefined`。
 *
 * @example
 * ```typescript
 * // 假设有以下字段和存储配置
 * const field: IField = { name: 'exampleField' };
 * const store: BaseStore = {
 *   fieldsConfig: {
 *     exampleField: {
 *       'x-splitter': ','
 *     }
 *   }
 * };
 *
 * const splitter = getFieldSplitter(field, store);
 * console.log(splitter); // 输出: ','
 * ```
 *
 * @example
 * ```typescript
 * // 当字段配置中没有分隔符时
 * const field: IField = { name: 'exampleField' };
 * const store: BaseStore = {
 *   fieldsConfig: {
 *     exampleField: {}
 *   }
 * };
 *
 * const splitter = getFieldSplitter(field, store);
 * console.log(splitter); // 输出: undefined
 * ```
 */
export const getFieldSplitter = (field: IField, store: BaseStore) => {
  const fieldConfig = getFieldConfig(field, store.fieldsConfig);
  return fieldConfig?.['x-splitter'] as string | undefined;
};

/**
 * 获取字段配置
 *
 * @param field - 字段名
 * @param fieldsConfig - 字段配置对象，可选
 * @returns 返回字段的配置，如果未找到则返回 undefined
 *
 * @example
 * // 示例 1: 简单字段
 * const field = 'name';
 * const fieldsConfig = { name: { type: 'string' } };
 * const result = getFieldConfig(field, fieldsConfig);
 * console.log(result); // 输出: { type: 'string' }
 *
 * @example
 * // 示例 2: 嵌套字段
 * const field = 'address.city';
 * const fieldsConfig = {
 *   address: {
 *     properties: {
 *       city: { type: 'string' }
 *     }
 *   }
 * };
 * const result = getFieldConfig(field, fieldsConfig);
 * console.log(result); // 输出: { type: 'string' }
 *
 * @example
 * // 示例 3: 未找到字段配置
 * const field = 'age';
 * const fieldsConfig = { name: { type: 'string' } };
 * const result = getFieldConfig(field, fieldsConfig);
 * console.log(result); // 输出: undefined
 *
 * @example
 * // 示例 4: 无 fieldsConfig 参数
 * const field = 'name';
 * const result = getFieldConfig(field);
 * console.log(result); // 输出: undefined
 */
export const getFieldConfig = (field: IField, fieldsConfig?: IFieldsConfig) => {
  if (!fieldsConfig) return undefined;
  const conf = fieldsConfig[field];
  if (conf) {
    return conf;
  }
  // 分割取值 当前只支持 obj 暂不支持数组 数组类型使用数组组件进行迭代处理
  if (typeof field !== 'string') return undefined;
  const keys = field.split('.');

  let levelConf = fieldsConfig[keys[0]];

  for (let i = 1; i < keys.length; i++) {
    if (!levelConf) {
      break;
    }
    const properties = levelConf?.properties as IFieldsConfig;
    levelConf = properties?.[keys[i]];
  }
  return levelConf;
};

export type IField<P extends object = IStrKeyObject> = keyof P | string;

export type IFieldsConfig = Record<string, IFieldConfig>;

export type IFieldConfig = ISchema<IAny> & {
  // 分割符 当使用字符串表示数组时使用
  'x-splitter'?: string;
  // 字段的提示
  'x-tooltip'?: string | IAnyObject;
  // 当在列表页表格渲染时使用
  'x-column'?: IAnyObject & { key?: IObjKey, width?: number | string }
  // 唯一标识字段 用于在多级系统时用于编辑时的数据匹配
  'x-id'?: string
  //
  'x-edit-config'?: IAnyObject
};
