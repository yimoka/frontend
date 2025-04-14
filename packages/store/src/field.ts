/**
 * @remarks 字段管理模块，提供字段值的转换、解析和配置管理功能
 * @author ickeep <i@ickeep.com>
 * @module @yimoka/store
 */

import { IAny, IObjKey, IStrKeyObject, IAutoSorter, JSONParse, JSONStringify, IAutoFilter } from '@yimoka/shared';

import { BaseStore } from './base';
import { ISchema, ITooltip } from './schema';

/**
 * 将值转换为搜索参数字符串
 * @param value - 要转换的值
 * @returns 转换后的字符串
 * @remarks 如果值是对象，则转换为 JSON 字符串；否则转换为普通字符串。null 或 undefined 返回空字符串
 * @example
 * ```ts
 * // 对象转 JSON 字符串
 * valueToSearchParam({ key: 'value' });
 * // 返回: '{"key":"value"}'
 *
 * // 数字转字符串
 * valueToSearchParam(123);
 * // 返回: '123'
 *
 * // 字符串保持不变
 * valueToSearchParam('hello');
 * // 返回: 'hello'
 *
 * // null 返回空字符串
 * valueToSearchParam(null);
 * // 返回: ''
 * ```
 */
export const valueToSearchParam = (value: IAny) => (typeof value === 'object' ? JSONStringify(value) : value?.toString?.() ?? '');

/**
 * 解析搜索参数
 * @param searchParam - 搜索参数字符串
 * @param schema - 字段模式定义
 * @param dfValue - 默认值，用于类型推断
 * @returns 解析后的值
 * @remarks 根据模式定义将字符串参数转换为对应类型的值
 * @example
 * ```ts
 * // 解析数字类型
 * parseSearchParam('123', { type: 'number' });
 * // 返回: 123
 *
 * // 解析布尔类型
 * parseSearchParam('true', { type: 'boolean' });
 * // 返回: true
 *
 * // 解析数组类型
 * parseSearchParam('[1,2,3]', { type: 'array' });
 * // 返回: [1, 2, 3]
 *
 * // 解析对象类型
 * parseSearchParam('{"name":"张三"}', { type: 'object' });
 * // 返回: { name: '张三' }
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
 * 获取字段分隔符
 * @param field - 字段名或字段对象
 * @param store - 存储实例
 * @returns 字段分隔符
 * @remarks 根据字段配置获取对应的分隔符，用于处理数组类型的字段值
 * @example
 * ```ts
 * const store = new BaseStore({
 *   fieldsConfig: {
 *     tags: { 'x-splitter': ',' }
 *   }
 * });
 * getFieldSplitter('tags', store);
 * // 返回: ','
 * ```
 */
export const getFieldSplitter = (field: IField, store: BaseStore) => {
  const fieldConfig = getFieldConfig(field, store.fieldsConfig);
  return fieldConfig?.['x-splitter'] as string | undefined;
};

/**
 * 获取字段配置
 * @param field - 字段名或字段对象
 * @param fieldsConfig - 字段配置对象
 * @returns 字段配置
 * @remarks 根据字段名获取对应的配置信息
 * @example
 * ```ts
 * const fieldsConfig = {
 *   name: { type: 'string', required: true },
 *   age: { type: 'number', min: 0 }
 * };
 * getFieldConfig('name', fieldsConfig);
 * // 返回: { type: 'string', required: true }
 * ```
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

/**
 * 字段类型
 * @template P - 对象类型
 * @remarks 字段可以是对象的键名或字符串
 */
export type IField<P extends object = IStrKeyObject> = keyof P | string | number

/**
 * 字段配置类型
 * @remarks 字段配置的键值对映射
 */
export type IFieldsConfig = Record<string, IFieldConfig>;

/**
 * 字段配置项类型
 * @remarks 字段配置项继承自模式定义
 */
export type IFieldConfig = ISchema & {
  /** 输出显示的 schema */
  'x-output-schema'?: ISchema;
  /** 查询的 schema 在查询 store 中,生成的 ref 会合并 'x-query-schema' 的配置 例如: 可在其中定义 required 为 false 来实现非必填 */
  'x-query-schema'?: ISchema;
  /** 表格列配置 */
  'x-column'?: IFieldColumn
};


/**
 * 表格列配置
 * @remarks 表格列配置项
 */
export type IFieldColumn = {
  /** 列唯一标识 */
  key?: IObjKey;
  /** 列标题 */
  title?: string | IAny
  /** 列宽 */
  width?: number | string;
  /** 列对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 自动过滤 根据数据自动生成过滤选项 当为 true 时,为受控跟 store 关联*/
  autoFilter?: IAutoFilter
  /** 筛选值的 key */
  filterValueKey?: string
  /** 提示信息 */
  tooltip?: ITooltip

  [key: IObjKey]: IAny;
} & IAutoSorter

