import { reaction } from '@formily/reactive';
import { dataToOptions, IAny, IAnyObject, IKeys, IObjKey, IOptions, isBlank, isSuccess, optionsToObj, strToArr } from '@yimoka/shared';
import { pick } from 'lodash-es';

import { IStoreAPI, IStoreResponse, runAPI } from './api';
import { BaseStore } from './base';
import { getFieldSplitter, IField } from './field';

// 初始化字典数据
export const initStoreDict = (store: BaseStore) => {
  const { dictConfig, apiExecutor } = store;
  dictConfig?.forEach((conf) => {
    const { type, field, data, api } = conf;
    if (data) {
      store.setFieldDict(field, data);
    }
    if (type !== 'by') {
      if (api) {
        store.setFieldDictLoading(field, true);
        const lastFetchID = store.incrDictFetchID(field);
        runAPI(api, apiExecutor)?.then?.((res: IStoreResponse) => {
          if (lastFetchID === store.getDictFetchID(field)) {
            store.setFieldDictLoading(field, false);
            if (isSuccess(res)) {
              const apiData = getDictAPIData(res.data, conf);
              store.setFieldDict(field, apiData);
            }
          }
        });
      }
    }
  });
};

// 字典数据处理
export const watchStoreDict = (store: BaseStore) => {
  const disposerArr: (() => void)[] = [];
  const { values, dictConfig, apiExecutor } = store;
  dictConfig?.forEach((conf) => {
    const { type } = conf;
    if (type === 'by') {
      const { field, getData, api, byField, isEmptyGetData = false, toMap, toOptions, keys } = conf;
      const updateDict = (newValues: IAny) => {
        if (!isEmptyGetData && (isBlank(newValues) || (Array.isArray(byField) && byField.every(item => isBlank(newValues[item]))))) {
          store.incrDictFetchID(field);
          store.setFieldDict(field, []);
          updateValueByDict(conf, [], store);
        } else {
          if (getData) {
            const dictData = getData(newValues, store);
            if (dictData instanceof Promise) {
              store.setFieldDictLoading(field, true);
              const lastFetchID = store.incrDictFetchID(field);
              dictData.then((data: IOptions | IAny) => {
                if (lastFetchID === store.getDictFetchID(field)) {
                  store.setFieldDictLoading(field, false);
                  store.setFieldDict(field, data);
                  updateValueByDict(conf, data, store);
                }
              });
            } else {
              store.setFieldDict(field, dictData);
              updateValueByDict(conf, dictData, store);
            }
          } else if (api) {
            const lastFetchID = store.incrDictFetchID(field);
            store.setFieldDictLoading(field, true);
            runAPI(api, apiExecutor, newValues)?.then((res: IStoreResponse) => {
              if (lastFetchID === store.getDictFetchID(field)) {
                store.setFieldDictLoading(field, false);
                if (isSuccess(res)) {
                  const apiData = res.data;
                  if (toMap && Array.isArray(apiData)) {
                    store.setFieldDict(field, optionsToObj(res.data, keys));
                  } else if (toOptions) {
                    store.setFieldDict(field, dataToOptions(res.data, keys));
                  } else {
                    store.setFieldDict(field, apiData);
                  }
                  updateValueByDict(conf, apiData, store);
                }
              }
            });
          }
        }
      };
      const obj = pick(values, byField);
      updateDict(obj);
      disposerArr.push(reaction(() => pick(values, byField), (newVal) => {
        updateDict(newVal);
      }));
    }
  });
  return () => {
    disposerArr.forEach(disposer => disposer());
  };
};

const updateValueByDict = (config: IDictConfigItemBy, dict: IAny, store: BaseStore) => {
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

// 获取字典的接口数据
const getDictAPIData = (data: IAny, dictConf: IDictConfigItemBase) => {
  const { toMap, toOptions = true, keys } = dictConf;
  if (toMap && Array.isArray(data)) {
    return optionsToObj(data, keys);
  } if (toOptions) {
    return dataToOptions(data, { keys });
  }
  return data;
};

export type IStoreDict<V extends object = IAnyObject> = { [key in IField<V>]?: IAny };

export type IStoreDictLoading<V extends object = IAnyObject> = { [key in IField<V> | IObjKey]?: boolean };

export type IStoreDictConfig<V extends object = IAnyObject> = Array<IDictConfigItem<V>>;

type IDictConfigItemBase = {
  field: string,
  data?: IOptions | IAny,
  api?: IStoreAPI
  // 只处理 api 返回值 默认为 true
  toOptions?: boolean
  // 只处理 api 返回值
  toMap?: boolean
  // 只处理 api 返回值
  keys?: IKeys
  // 只处理 api 返回值
  childrenKey?: string
}

export type IDictConfigItem<V extends object = IAnyObject> = ({ type?: 'self' } & IDictConfigItemBase) | IDictConfigItemBy<V>;

export type IDictConfigItemBy<V extends object = IAnyObject> = IDictConfigItemBase & {
  type: 'by'
  byField: string | string[],
  // 当存在 getData 不会调用 api
  getData?: (values: V | IAnyObject, store: BaseStore) => IOptions | IAny | Promise<IOptions | IAny>,
  paramKeys?: string | Record<string, IAny>
  // 字典变化时是否更新值
  isUpdateValue?: boolean
  // 字典为空时是否获取数据
  isEmptyGetData?: boolean
}
