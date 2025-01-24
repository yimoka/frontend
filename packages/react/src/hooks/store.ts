import { useExpressionScope } from '@formily/react';
import { IAnyObject } from '@yimoka/shared';
import { BaseStore, IStore, IStoreConfig, StoreMap } from '@yimoka/store';

import { useMemo, useState } from 'react';

import { useAPIExecutor, useNotifier } from '../context/config';

export function useInitStore<V extends object = IAnyObject, R extends object = IAnyObject>(store: IStore<V, R> | IStoreConfig<V, R>) {
  const apiExecutor = useAPIExecutor();
  const notifier = useNotifier();
  // 初始化后不再变化
  const [curStore] = useState(() => {
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
  });

  return curStore;
}

export const useStore = <V extends object = IAnyObject, R extends object = IAnyObject>(store?: IStore<V, R> | false) => {
  const scope = useExpressionScope();
  return useMemo(() => (store === false ? undefined : (store ?? (scope?.$store as IStore<V, R>))), [store, scope]);
};
