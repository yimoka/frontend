/**
 * @remarks 字典管理模块，提供数据字典的初始化、监听和更新功能
 * @author ickeep <i@ickeep.com>
 * @module @yimoka/store
 */

import { reaction } from '@formily/reactive';
import { dataToOptions, IAny, IAnyObject, IKeys, IObjKey, IOptions, isBlank, isSuccess, optionsToObj, strToArr } from '@yimoka/shared';
import { pick } from 'lodash-es';

import { IStoreAPI, IStoreResponse, runAPI } from './api';
import { BaseStore } from './base';
import { getFieldSplitter, IField } from './field';

/**
 * 初始化字典数据
 * @param store - 存储实例
 * @remarks 根据配置初始化字典数据，支持静态数据和 API 请求
 * @example
 * ```ts
 * const store = new BaseStore({
 *   dictConfig: [
 *     {
 *       field: 'gender',
 *       data: [
 *         { label: '男', value: 'male' },
 *         { label: '女', value: 'female' }
 *       ]
 *     },
 *     {
 *       field: 'status',
 *       api: { url: '/api/status-options' }
 *     }
 *   ]
 * });
 * initStoreDict(store);
 * ```
 */
export const initStoreDict = (store: BaseStore) => {
  const { dictConfig, apiExecutor } = store;
  dictConfig?.forEach((conf) => {
    const { type, field, data, api } = conf;
    // 设置静态数据
    if (data) {
      store.setFieldDict(field, data);
    }
    // 处理非 by 类型的字典配置
    if (type !== 'by') {
      if (api) {
        store.setFieldDictLoading(field, true);
        const lastFetchID = store.incrDictFetchID(field);
        runAPI(api, apiExecutor).then((res: IStoreResponse) => {
          if (lastFetchID === store.getDictFetchID(field)) {
            if (isSuccess(res)) {
              const apiData = getDictAPIData(res.data, conf);
              store.setFieldDict(field, apiData);
            }
            store.setFieldDictLoading(field, false);
          }
        })
          .catch(() => {
            if (lastFetchID === store.getDictFetchID(field)) {
              store.setFieldDictLoading(field, false);
            }
          });
      }
    }
  });
};

/**
 * 监听字典数据变化
 * @param store - 存储实例
 * @remarks 监听表单值变化，根据配置更新字典数据
 * @returns 清理函数数组
 * @example
 * ```ts
 * const store = new BaseStore({
 *   dictConfig: [
 *     {
 *       type: 'by',
 *       field: 'city',
 *       byField: 'province',
 *       api: { url: '/api/cities' }
 *     }
 *   ]
 * });
 * const disposers = watchStoreDict(store);
 * // 清理监听器
 * disposers.forEach(dispose => dispose());
 * ```
 */
export const watchStoreDict = (store: BaseStore) => {
  const disposerArr: (() => void)[] = [];
  const { values, dictConfig, apiExecutor } = store;
  dictConfig?.forEach((conf) => {
    const { type } = conf;
    // 处理 by 类型的字典配置
    if (type === 'by') {
      const { field, getData, api, byField, isEmptyGetData = false, toMap, toOptions, keys } = conf;
      const updateDict = (newValues: IAny) => {
        // 处理空值情况
        if (!isEmptyGetData && (isBlank(newValues) || (Array.isArray(byField) ? byField.every(item => isBlank(newValues[item])) : isBlank(newValues[byField])))) {
          store.incrDictFetchID(field);
          store.setFieldDict(field, []);
          updateValueByDict(conf, [], store);
          return;
        }

        // 使用 getData 或 API 获取字典数据
        if (getData) {
          const dictData = getData(newValues, store);
          if (dictData instanceof Promise) {
            store.setFieldDictLoading(field, true);
            const lastFetchID = store.incrDictFetchID(field);
            dictData.then((data: IOptions | IAny) => {
              if (lastFetchID === store.getDictFetchID(field)) {
                store.setFieldDict(field, data);
                updateValueByDict(conf, data, store);
                store.setFieldDictLoading(field, false);
              }
            }).catch(() => {
              if (lastFetchID === store.getDictFetchID(field)) {
                store.setFieldDictLoading(field, false);
              }
            });
          } else {
            store.setFieldDict(field, dictData);
            updateValueByDict(conf, dictData, store);
          }
        } else if (api) {
          const lastFetchID = store.incrDictFetchID(field);
          store.setFieldDictLoading(field, true);
          runAPI(api, apiExecutor, newValues).then((res: IStoreResponse) => {
            if (lastFetchID === store.getDictFetchID(field)) {
              if (isSuccess(res)) {
                const apiData = res.data;
                if (toMap && Array.isArray(apiData)) {
                  store.setFieldDict(field, optionsToObj(apiData, keys));
                } else if (toOptions) {
                  store.setFieldDict(field, dataToOptions(apiData, keys));
                } else {
                  store.setFieldDict(field, apiData);
                }
                updateValueByDict(conf, apiData, store);
              }
              store.setFieldDictLoading(field, false);
            }
          })
            .catch(() => {
              if (lastFetchID === store.getDictFetchID(field)) {
                store.setFieldDictLoading(field, false);
              }
            });
        }
      };
      const obj = pick(values, byField);
      updateDict(obj);
      disposerArr.push(reaction(() => pick(values, byField), (newVal) => {
        updateDict(newVal);
      }));
    }
  });
  return disposerArr;
};

/**
 * 根据字典更新字段值
 * @param config - 字典配置项
 * @param dict - 字典数据
 * @param store - 存储实例
 * @remarks 根据字典配置更新相关字段的值
 */
export const updateValueByDict = (config: IDictConfigItemBy, dict: IAny, store: BaseStore) => {
  const { field, isUpdateValue = true, keys, childrenKey } = config;
  if (isUpdateValue) {
    const { values } = store;
    const oldValue = values[field];
    const type = typeof oldValue;
    const splitter = getFieldSplitter(field, store);
    // 当存在分割符时 认为是多选支持按分割符分割的字符串
    const isMultiple = !!splitter;
    const isToArr = isMultiple && type === 'string';

    const options = dataToOptions(dict, { keys, splitter, childrenKey });
    const haveMap: Record<string, boolean> = {};
    options.forEach(item => haveMap[item.value] = true);

    const getOldArr = () => {
      if (Array.isArray(oldValue)) {
        return oldValue;
      }
      return isToArr ? strToArr(oldValue, splitter) : [oldValue];
    };

    const oldArr = getOldArr();
    const newArr = oldArr.filter(item => haveMap[item]);

    if (newArr.length !== oldArr.length) {
      const getNewValue = () => {
        if (Array.isArray(oldValue)) {
          return newArr;
        }
        return isToArr ? newArr.join(splitter) : newArr[0];
      };
      store.setFieldValue(field, getNewValue());
    }
  }
};

/**
 * 处理 API 返回的字典数据
 * @param data - API 返回的数据
 * @param dictConf - 字典配置
 * @returns 处理后的字典数据
 */
export const getDictAPIData = (data: IAny, dictConf: IDictConfigItemBase) => {
  const { toMap, toOptions = true, keys } = dictConf;
  if (toMap && Array.isArray(data)) {
    return optionsToObj(data, keys);
  } if (toOptions) {
    return dataToOptions(data, { keys });
  }
  return data;
};

/**
 * 存储字典类型
 * @template V - 值的类型
 */
export type IStoreDict<V extends object = IAnyObject> = { [key in IField<V>]?: IAny };

/**
 * 字典加载状态类型
 * @template V - 值的类型
 */
export type IStoreDictLoading<V extends object = IAnyObject> = { [key in IField<V> | IObjKey]?: boolean };

/**
 * 字典配置类型
 * @template V - 值的类型
 */
export type IStoreDictConfig<V extends object = IAnyObject> = Array<IDictConfigItem<V>>;

/**
 * 基础字典配置项类型
 */
type IDictConfigItemBase = {
  /** 字段名 */
  field: string;
  /** 静态数据 */
  data?: IOptions | IAny;
  /** API 配置 */
  api?: IStoreAPI;
  /** 是否转换为选项格式，默认为 true */
  toOptions?: boolean;
  /** 是否转换为 Map 格式 */
  toMap?: boolean;
  /** 键值映射 */
  keys?: IKeys;
  /** 子节点键名 */
  childrenKey?: string;
}

/**
 * 字典配置项类型
 * @template V - 值的类型
 */
export type IDictConfigItem<V extends object = IAnyObject> = ({ type?: 'self' } & IDictConfigItemBase) | IDictConfigItemBy<V>;

/**
 * 基于字段值的字典配置项类型
 * @template V - 值的类型
 */
export type IDictConfigItemBy<V extends object = IAnyObject> = IDictConfigItemBase & {
  /** 配置类型 */
  type: 'by';
  /** 依赖的字段 */
  byField: string | string[];
  /** 获取数据的函数，优先级高于 API */
  getData?: (values: V | IAnyObject, store: BaseStore) => IOptions | IAny | Promise<IOptions | IAny>;
  /** 参数键名映射 */
  paramKeys?: string | Record<string, IAny>;
  /** 字典变化时是否更新值 */
  isUpdateValue?: boolean;
  /** by 的值为空时是否获取数据 */
  isEmptyGetData?: boolean;
}
