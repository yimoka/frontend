import { ISchema } from '@formily/json-schema';
import { IAny, IAnyObject, JSONParse, JSONStringify } from '@yimoka/shared';

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
