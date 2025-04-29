import { useField } from '@formily/react';
import { dataToOptions, IAny, IAPIRequestConfig, IHTTPResponse, IOptions, isSuccess, IOptionsConfig } from '@yimoka/shared';
import { runAPI } from '@yimoka/store';
import { useState, Dispatch, SetStateAction } from 'react';

import { useAPIExecutor } from '../context/config';

import { useDeepEffect } from './deep-effect';
import { useDeepMemo } from './deep-memo';

export const defaultOutOptionsKeys = { title: 'title', desc: 'desc', img: 'img', icon: 'icon', url: 'url', click: 'click', routeType: 'routeType' };

export type IOptionsAPI = IAPIRequestConfig | ((config?: IAPIRequestConfig) => Promise<IHTTPResponse>);

export const useAPIOptions = <T extends string = 'label' | 'value'>(data?: IAny, api?: IOptionsAPI, config?: IOptionsConfig<T>): [IOptions<T>, boolean, Dispatch<SetStateAction<IOptions<T>>>] => {
  const [options, setOptions] = useState<IOptions<T>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { dataSource } = useField() as IAny ?? {};
  const curData = data ?? dataSource;
  const { keys, splitter, childrenKey } = config ?? {};

  const apiExecutor = useAPIExecutor();
  const apiFn = useDeepMemo(() => (!api ? undefined : () => runAPI(api, apiExecutor)), [apiExecutor, api]);

  useDeepEffect(() => {
    curData && setOptions(dataToOptions(curData, config));
  }, [childrenKey, curData, keys, splitter]);

  useDeepEffect(() => {
    apiFn && setLoading(true);
    apiFn?.()?.then((res: IAny) => {
      isSuccess(res) && setOptions(dataToOptions(res.data, config));
      setLoading(false);
    });
  }, [apiFn, childrenKey, keys, splitter]);

  return [options, loading, setOptions];
};
