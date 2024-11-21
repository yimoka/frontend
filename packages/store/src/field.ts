import { ISchema } from '@formily/json-schema';
import { DF_SPLITTER, IAny, IAnyObject, JSONParse, JSONStringify } from '@yimoka/shared';

import { BaseStore } from './base';

export const getSearchParamByValue = (value: IAny) => (typeof value === 'object' ? JSONStringify(value) : value?.toString?.() ?? '');

export const getValueBySearchParam = (searchParam?: string, schema: ISchema = {}, dfValue: IAny = '') => {
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

export const getFieldIsMultiple = (field: IField, store: BaseStore) => {
  const mode = getFieldConfig(field, store.fieldsConfig)?.['x-component-props']?.mode;
  return !!(mode && ['multiple', 'tags'].includes(mode));
};

export const getFieldSplitter = (field: IField, store: BaseStore) => {
  const fieldConfig = getFieldConfig(field, store.fieldsConfig);
  return fieldConfig?.['x-component-props']?.splitter ?? DF_SPLITTER;
};

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

export type IField<P extends object = IAnyObject> = keyof P | string;

export type IFieldsConfig<V extends object = IAnyObject> = Record<IField<V>, IFieldConfig>;

export type IFieldConfig = ISchema<IAny> & {
  // 字段的提示
  tooltip?: string | IAnyObject;
  // 用于配置表格列的属性 列表页
  column?: IAnyObject,
  // 用于配置描述列表的属性 详情页
  desc?: IAnyObject
  // 显示的属性
  read?: IAnyObject
};
