import { useExpressionScope } from '@formily/react';
import { IAnyObject } from '@yimoka/shared';
import { BaseStore, IStore, IStoreConfig, StoreMap } from '@yimoka/store';

import { useMemo } from 'react';

import { useAPIExecutor, useNotifier } from '../context/config';

import { useDeepMemo } from './deep-memo';

export function useInitStore<V extends object = IAnyObject, R extends object = IAnyObject>(store: IStore<V, R> | IStoreConfig<V, R>) {
  const apiExecutor = useAPIExecutor();
  const notifier = useNotifier();
  const curStore = useDeepMemo(() => {
    if (store instanceof BaseStore) {
      if (!store.apiExecutor) {
        // eslint-disable-next-line no-param-reassign
        store.apiExecutor = apiExecutor;
      }
      if (!store.notifier) {
        // eslint-disable-next-line no-param-reassign
        store.notifier = notifier;
      }
      return store;
    }
    const { type = 'base', ...args } = store;
    return new StoreMap[type]({ apiExecutor, notifier, ...args });
  }, [apiExecutor, notifier, store]);

  return curStore;
}

export const useStore = <V extends object = IAnyObject, R extends object = IAnyObject>(store?: IStore<V, R>) => {
  const scope = useExpressionScope();
  return useMemo(() => store ?? (scope?.curStore as IStore<V, R> ?? {}), [store, scope]);
};
