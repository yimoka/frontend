import { useField } from '@formily/react';
import { addWithLimit, dataToOptions, IAny, IKeys, IOptions, isSuccess, isVacuous, isValueInOptions, IOptionsConfig } from '@yimoka/shared';
import { IStoreResponse, runAPI } from '@yimoka/store';
import { debounce } from 'lodash-es';
import { useState, useRef, SetStateAction, Dispatch, useEffect, useMemo } from 'react';

import { useAPIExecutor } from '../context/config';

import { IOptionsAPI } from './api-options';
import { useDeepEffect } from './deep-effect';
import { useDeepMemo } from './deep-memo';

export interface IOptionsAPISearchConfig<T extends string = 'label' | 'value'> {
  request?: IKeys
  keys?: IKeys<T>
  wait?: number
}

export const useAPISearch = <T extends string = 'label' | 'value'>(
  input?: string,
  value?: IAny,
  data?: IAny,
  api?: IOptionsAPI,
  labelAPI?: IOptionsAPI | boolean,
  searchConfig?: IOptionsAPISearchConfig,
  config?: IOptionsConfig<T>,
): [IOptions<T>, boolean, Dispatch<SetStateAction<IOptions<T>>>] => {
  const [options, setOptions] = useState<IOptions<T>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // 是否根据 value 进行过反向查找 options
  const [valueSearched, setValueSearched] = useState<boolean>(false);
  const { dataSource } = useField() as IAny ?? {};
  const curData = data ?? dataSource;
  const fetchRef = useRef(0);

  const { keys, splitter, childrenKey } = config ?? {};

  const apiExecutor = useAPIExecutor();

  const apiFn = useDeepMemo(() => (!api ? undefined : (value: string) => {
    const getKey = () => searchConfig?.request?.label ?? keys?.label ?? 'name';
    const params = { [getKey()]: value };
    return runAPI(api, apiExecutor, params);
  }), [searchConfig, keys, api, apiExecutor]);


  const apiFnForValue = useDeepMemo(() => {
    const getKey = () => searchConfig?.request?.value ?? searchConfig?.keys?.value ?? keys?.value ?? 'id';
    if (labelAPI && typeof labelAPI !== 'boolean') {
      return (value: string) => runAPI(labelAPI, apiExecutor, { [getKey()]: value });
    }
    if (labelAPI === true && api) {
      return (value: string) => runAPI(api, apiExecutor, { [getKey()]: value });
    }
    return undefined;
  }, [searchConfig, apiExecutor, keys?.value, api]);

  // 时序、防抖 控制
  const fetcher = useDeepMemo(() => (fn?: (value: IAny) => undefined | Promise<IStoreResponse>) => {
    if (typeof fn !== 'function') {
      return undefined;
    }
    const loadOptions = (value: string) => {
      fetchRef.current = addWithLimit(fetchRef.current);
      const fetchId = fetchRef.current;
      setOptions([]);
      setLoading(true);
      fn(value)?.then((res) => {
        if (fetchId === fetchRef.current) {
          setLoading(false);
          const curKeys = (searchConfig?.keys ?? keys) as IKeys<T>;
          isSuccess(res) && setOptions(dataToOptions(res.data, { keys: curKeys, splitter, childrenKey }));
        }
      });
    };
    return debounce(loadOptions, searchConfig?.wait ?? 300);
  }, [childrenKey, keys, searchConfig, splitter]);

  const fetchOptions = useMemo(() => fetcher(apiFn), [apiFn, fetcher]);

  const fetchOptionsForValue = useMemo(() => fetcher(apiFnForValue), [apiFnForValue, fetcher]);

  useDeepEffect(() => {
    curData && setOptions(dataToOptions(curData, config));
  }, [childrenKey, curData, keys, splitter]);

  useEffect(() => {
    input && fetchOptions?.(input);
  }, [fetchOptions, input]);

  useEffect(() => {
    // 当 value 变化时，标识未进行过反向查找
    setValueSearched(false);
  }, [value]);


  // 当值变化是，反向查找 options,
  useDeepEffect(() => {
    const ifFetch = () => !valueSearched && !input && !loading && !isVacuous(value) && fetchOptionsForValue;
    // const curKeys = (searchConfig?.keys ?? keys) as IKeys<T>;
    // options 格式已处理，不需要再传 keys
    if (ifFetch() && !isValueInOptions(value, options, { childrenKey })) {
      setValueSearched(true);
      fetchOptionsForValue?.(value);
    }
  }, [childrenKey, fetchOptionsForValue, input, keys, loading, options, searchConfig?.keys, value, valueSearched]);

  return [options, loading, setOptions];
};
