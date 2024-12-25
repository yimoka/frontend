import { initStoreDict, IStore, watchStoreDict } from '@yimoka/store';
import { useEffect } from 'react';

export const StoreDict = (props: { store: IStore }) => {
  const { store } = props;
  useEffect(() => {
    initStoreDict(store);
    return watchStoreDict(store);
  }, [store]);
  return null;
};
