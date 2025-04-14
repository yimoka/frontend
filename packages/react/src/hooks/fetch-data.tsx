import { IAnyObject, IObjKey, isVacuous } from '@yimoka/shared';
import { IStore, IStoreAPI, IStoreResponse, runAPI } from '@yimoka/store';
import { get } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

import { IAny } from '../../../shared/types';
import { useAPIExecutor } from '../context/config';

import { useDeepEffect } from './deep-effect';
import { useStore } from './store';

export interface FetchDataConfig<T = IAny> {
  defaultData?: T;
  onError?: (error: Error | IStoreResponse) => void;
  dataKey?: string;
  watchParamsKeys?: Record<IObjKey, IObjKey>;
  watchParamsSource?: 'values' | 'responseData' | 'dict' | 'extInfo';
  store?: IStore | false;
  // 设置 Store 的扩展信息 如果存在则会将响应数据中的 data 设置到 store 的 extInfo 中
  setStoreExtInfoKey?: string;
}

export type IComponentWithFetchData<P = IAnyObject, D = IAny> = P & { api: IStoreAPI, fetchConfig: FetchDataConfig<D> };

export function useFetchData<T = IAny>(api: IStoreAPI, params?: IAnyObject, config?: FetchDataConfig<T>) {
  const { defaultData, dataKey = 'data', onError, watchParamsKeys, watchParamsSource = 'values', store, setStoreExtInfoKey } = config || {};
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<IStoreResponse<T> | null>(null);
  const apiExecutor = useAPIExecutor();
  const curStore = useStore(store);

  const watchParams = useMemo(() => {
    if (isVacuous(watchParamsKeys) || !curStore) {
      return;
    }
    const watchObj = {
      values: curStore.values,
      responseData: curStore.response,
      dict: curStore.dict,
      extInfo: curStore.extInfo,
    }[watchParamsSource] ?? curStore;
    return Object.entries(watchParamsKeys).reduce<Record<string, unknown>>((acc, [key, value]) => {
      acc[key] = get(watchObj, value);
      return acc;
    }, {});
  }, [curStore, watchParamsKeys, watchParamsSource]);

  useDeepEffect(() => {
    if (!apiExecutor) {
      return;
    }
    setLoading(true);
    runAPI(api, apiExecutor, { ...params, ...watchParams })
      .then((res) => {
        setLoading(false);
        setResponse(res);
      })
      .catch((error) => {
        setLoading(false);
        setResponse(null);
        onError?.(error);
      });
  }, [api, apiExecutor, dataKey, onError, params, watchParams]);

  const data = useMemo(() => (response ? get(response, dataKey) : defaultData), [response, dataKey, defaultData]);

  useEffect(() => {
    if (curStore && setStoreExtInfoKey) {
      curStore.setExtInfo(setStoreExtInfoKey, data);
    }
  }, [curStore, data, response, setStoreExtInfoKey]);

  return [loading, data, response];
};
