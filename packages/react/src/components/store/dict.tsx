import { initStoreDict, IStore, watchStoreDict } from '@yimoka/store';
import { useEffect } from 'react';

export const StoreDict = (props: { store: IStore }) => {
  const { store } = props;
  useEffect(() => {
    initStoreDict(store);
    const unwatch = watchStoreDict(store);
    return () => {
      unwatch?.forEach(fn => fn?.());
    };
  }, [store]);
  return null;
};
