/* eslint-disable @typescript-eslint/no-explicit-any */
// 选项(如下拉选择组件)数据处理
import { omit } from 'lodash-es';

import { strToArr } from './str';
import { IAnyObject, ObjKey } from './type';
import { isBlank } from './val';

export const DF_KEYS: IKeys = { label: 'label', value: 'value' };
export const DF_SPLITTER = ',';
export const DF_CHILDREN_KEY = 'children';

/**
 * 将数组转换为选项对象数组。
 *
 * @template T - 键的类型，默认为 'label' | 'value'。
 * @param {IOptions<T>} [options=[]] - 要转换的选项数组。
 * @param {IKeys<T>} [keys] - 键的映射对象。
 * @param {string} [childrenKey] - 子选项的键。
 * @returns {IOptions<T>} 转换后的选项对象数组。
 *
 * @example
 * const options = [
 *   { label: 'Option 1', value: '1' },
 *   { label: 'Option 2', value: '2', children: [{ label: 'Sub Option 1', value: '1-1' }] }
 * ];
 * const keys = { label: 'name', value: 'id', children: 'subOptions' };
 * const result = arrToOptions(options, keys, 'children');
 * // result: [
 * //   { name: 'Option 1', id: '1' },
 * //   { name: 'Option 2', id: '2', subOptions: [{ name: 'Sub Option 1', id: '1-1' }] }
 * // ]
 */
export function arrToOptions<T extends string = 'label' | 'value'>(options: IOptions<T> = [], keys?: IKeys<T>, childrenKey?: string): IOptions<T> {
  if (!keys) {
    return options;
  }
  const optionsKeys: string[] = [];
  const optionsValues: any[] = [];
  Object.entries(keys).forEach(([key, value]) => {
    if (key !== value) {
      optionsKeys.push(key);
      optionsValues.push(value);
    }
  });

  if (isBlank(optionsKeys)) {
    return options;
  }

  if (childrenKey && !optionsKeys.includes(childrenKey)) {
    optionsKeys.push(childrenKey);
  }

  return options?.map((item) => {
    const newItem: IAnyObject = omit(item, optionsValues);

    optionsKeys.forEach((key) => {
      const val = item[keys[key] ?? key];
      if (val !== undefined || newItem[key] !== undefined) {
        if (childrenKey && childrenKey === key) {
          if (Array.isArray(val)) {
            newItem[key] = arrToOptions(val, keys, childrenKey);
          } else if (val && typeof val === 'object') {
            newItem[key] = objToOptions(val, keys, childrenKey);
          } else {
            newItem[key] = [];
          }
        } else {
          newItem[key] = val;
        }
      }
    });
    return newItem as IOption<T>;
  });
};

/**
 * 将字符串转换为选项数组。
 *
 * @template T - 选项对象的键类型，默认为 'label' | 'value'。
 * @param {string} [str=''] - 要转换的字符串。
 * @param {string} [splitter=DF_SPLITTER] - 分隔符，用于将字符串拆分为数组。
 * @param {IKeys<T>} [keys] - 选项对象的键映射，如果未提供则使用默认键。
 * @returns {IOptions<T>} - 转换后的选项数组。
 *
 * @example
* ```typescript
 * const str = '选项1,选项2,选项3';
 * const options = strToOptions(str);
 * console.log(options);
 * // 输出: [{ label: '选项1', value: '选项1' }, { label: '选项2', value: '选项2' }, { label: '选项3', value: '选项3' }]
 *
 * const str = '选项1,选项2,选项3';
 * const splitter = ',';
 * const keys = { label: '标签', value: '值' };
 * const options = strToOptions(str, splitter, keys);
 * console.log(options);
 * // 输出: [{ 标签: '选项1', 值: '选项2' }, { 标签: '选项2', 值: '选项2' }, { 标签: '选项3', 值: '选项3' }]
 * ```
 */
export const strToOptions = <T extends string = 'label' | 'value'>(str = '', splitter = DF_SPLITTER, keys?: IKeys<T>): IOptions<T> => {
  const optionKeys = Object.values(keys ?? DF_KEYS) as T[];
  const arr = strToArr(str, splitter);
  return arr.map((item) => {
    const option: Record<string, string> = {};
    optionKeys.forEach((key: any) => option[key] = item);
    return option as IOption<T>;
  });
};

/**
 * 将对象转换为选项数组。
 *
 * @template T - 字符串类型，默认为 'label' | 'value'。
 * @param {IAnyObject} [obj={}] - 要转换的对象，默认为空对象。
 * @param {IKeys<T>} [keys] - 可选的键值对，用于指定选项的键。
 * @param {string} [childrenKey] - 可选的子项键。
 * @returns {IOptions<T>} 转换后的选项数组。
 *
 * @example
 * const obj = { a: '选项A', b: '选项B' };
 * const options = objToOptions(obj);
 * // 返回: [{ value: 'a', label: '选项A' }, { value: 'b', label: '选项B' }]
 *
 * @example
 * const obj = { a: { label: '选项A', extra: '额外信息' }, b: { label: '选项B' } };
 * const keys = { label: 'label', value: 'value' };
 * const options = objToOptions(obj, keys);
 * // 返回: [{ value: 'a', label: '选项A', extra: '额外信息' }, { value: 'b', label: '选项B' }]
 */
export const objToOptions = <T extends string = 'label' | 'value'>(obj: IAnyObject = {}, keys?: IKeys<T>, childrenKey?: string): IOptions<T> => {
  const options = !obj ? [] : Object.entries(obj).map(([key, value]) => {
    if (value && typeof value === 'object') {
      return { value: key, ...value };
    }
    return { value: key, label: value?.toString?.() ?? key };
  });
  return arrToOptions(options, keys, childrenKey);
};

/**
 * 将数据转换为选项数组。
 *
 * @template T - 用于键的泛型，默认为 'label' | 'value'。
 * @param {any} [data] - 要转换的数据，可以是数组、字符串或对象。
 * @param {Object} [conf] - 选项配置对象。
 * @param {IKeys<T>} [conf.keys] - 键的映射配置。
 * @param {string} [conf.splitter=DF_SPLITTER] - 分隔符，默认为 DF_SPLITTER。
 * @param {string} [conf.childrenKey] - 子项键名，如果需要递归处理时显性传入。
 * @returns {IOptions<T>} 转换后的选项数组。
 *
 * @example
 * // 示例 1: 数组数据
 * const dataArray = [{ label: '选项1', value: 1 }, { label: '选项2', value: 2 }];
 * const options1 = dataToOptions(dataArray);
 * console.log(options1);
 * // 输出: [{ label: '选项1', value: 1 }, { label: '选项2', value: 2 }]
 *
 * @example
 * // 示例 2: 字符串数据
 * const dataString = '选项1,选项2,选项3';
 * const options2 = dataToOptions(dataString, { splitter: ',' });
 * console.log(options2);
 * // 输出: [{ label: '选项1', value: '选项1' }, { label: '选项2', value: '选项2' }, { label: '选项3', value: '选项3' }]
 *
 * @example
 * // 示例 3: 对象数据
 * const dataObject = { key1: '选项1', key2: '选项2' };
 * const options3 = dataToOptions(dataObject);
 * console.log(options3);
 * // 输出: [{ label: 'key1', value: '选项1' }, { label: 'key2', value: '选项2' }]
 */
export const dataToOptions = <T extends string = 'label' | 'value'>(data?: any, conf?: { keys?: IKeys<T>, splitter?: string, childrenKey?: string }): IOptions<T> => {
  // 不给 childrenKey 默认值，需要递归处理时 再调用时显性传入
  const { splitter = DF_SPLITTER, keys, childrenKey } = conf ?? {};
  if (Array.isArray(data)) {
    return arrToOptions(data, keys, childrenKey);
  }

  if (typeof data === 'string') {
    return strToOptions(data, splitter, keys);
  }

  if (typeof data === 'object') {
    return objToOptions(data, keys, childrenKey);
  }
  return [];
};

/**
 * 检查给定的值是否在选项列表中。
 *
 * @param value - 要检查的值，可以是单个值或值的数组。
 * @param options - 选项列表，包含多个选项对象。
 * @param conf - 可选的配置对象，包含键名和子选项键名。
 * @param conf.keys - 包含键名的对象。
 * @param conf.keys.value - 用于比较值的键名，默认为 `DF_KEYS.value`。
 * @param conf.childrenKey - 子选项的键名，如果选项对象包含子选项。
 * @returns 如果值在选项列表中，则返回 `true`，否则返回 `false`。
 *
 * @example
 * // 示例 1: 单个值在选项列表中
 * const options = [{ value: 1 }, { value: 2 }, { value: 3 }];
 * const result = isValueInOptions(2, options);
 * console.log(result); // 输出: true
 *
 * @example
 * // 示例 2: 值不在选项列表中
 * const options = [{ value: 1 }, { value: 2 }, { value: 3 }];
 * const result = isValueInOptions(4, options);
 * console.log(result); // 输出: false
 *
 * @example
 * // 示例 3: 带有子选项的情况
 * const options = [
 *   { value: 1, children: [{ value: 4 }, { value: 5 }] },
 *   { value: 2 },
 *   { value: 3 }
 * ];
 * const result = isValueInOptions(4, options, { childrenKey: 'children' });
 * console.log(result); // 输出: true
 *
 * @example
 * // 示例 4: 值为数组的情况
 * const options = [{ value: 1 }, { value: 2 }, { value: 3 }];
 * const result = isValueInOptions([1, 2], options);
 * console.log(result); // 输出: true
 *
 * @example
 * // 示例 5: 值为数组的情况，其中一个值不在选项列表中
 * const options = [{ value: 1 }, { value: 2 }, { value: 3 }];
 * const result = isValueInOptions([1, 4], options);
 * console.log(result); // 输出: false
 */

export const isValueInOptions = (value: any, options: IOptions<'value'>, conf?: { keys?: IKeys<'value'>, childrenKey?: string }): boolean => {
  const { keys, childrenKey } = conf ?? {};
  const key = keys?.value ?? DF_KEYS.value;
  const isSome = (val: any, arr: IOptions<'value'>) => arr?.some((option) => {
    if (option[key] === val) {
      return true;
    }
    if (childrenKey && option[childrenKey]) {
      return isValueInOptions(value, option[childrenKey], conf);
    }
    return false;
  });
  if (Array.isArray(value)) {
    return value.every(item => isSome(item, options));
  }
  return isSome(value, options);
};

/**
 * 将选项数组转换为键值对映射。
 *
 * @param {IOptions} options - 选项数组。
 * @param {IKeys} [keys] - 可选的键名配置对象。
 * @returns {Record<ObjKey, any>} 键值对映射。
 *
 * @example
 * // 示例 1: 使用默认键名
 * const options = [
 *   { id: 1, name: 'Option 1' },
 *   { id: 2, name: 'Option 2' }
 * ];
 * const map = optionsToMap(options);
 * console.log(map); // { 1: 'Option 1', 2: 'Option 2' }
 *
 * @example
 * // 示例 2: 使用自定义键名
 * const options = [
 *   { key: 'a', value: 'Alpha' },
 *   { key: 'b', value: 'Beta' }
 * ];
 * const keys = { value: 'key', label: 'value' };
 * const map = optionsToMap(options, keys);
 * console.log(map); // { a: 'Alpha', b: 'Beta' }
 *
 * @example
 * // 示例 3: 输入为对象
 * const options = { a: 'Alpha', b: 'Beta' };
 * const map = optionsToMap(options);
 * console.log(map); // { a: 'Alpha', b: 'Beta' }
 *
 * @example
 * // 示例 4: 输入为非数组和非对象
 * const options = 'invalid';
 * const map = optionsToMap(options);
 * console.log(map); // {}
 */

export const optionsToObj = (options: IOptions, keys?: IKeys) => {
  const map: Record<ObjKey, any> = Object({});
  const valueKey = keys?.value ?? DF_KEYS.value;
  const labelKey = keys?.label ?? DF_KEYS.label;
  if (!Array.isArray(options)) {
    return typeof options === 'object' && options ? options : map;
  }
  options.forEach((option) => {
    const vKey = option[valueKey];
    const lKey = option[labelKey];
    if (vKey !== undefined && lKey !== undefined) {
      map[vKey] = lKey;
    }
  });
  return map;
};


export type IOptions<T extends ObjKey = 'label' | 'value'> = Array<IOption<T>>;


export type IOption<T extends ObjKey = 'label' | 'value'> = { [key in T]?: any } & { [key: string]: any };


export type IKeys<T extends ObjKey = 'label' | 'value'> = { [key in T | string]: string };
