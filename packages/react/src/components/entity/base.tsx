import { observer } from '@formily/react';
import { IAnyObject } from '@yimoka/shared';
import { IStore, IStoreConfig } from '@yimoka/store';

import { useInitStore } from '../../hooks/store';
import { StoreDict } from '../store/dict';
import { StoreRoute } from '../store/route';

import { EntitySchema, EntitySchemaProps } from './schema';

export const Entity = observer((props: IEntityProps) => {
  const { store, ...args } = props;
  const curStore = useInitStore(store);

  return (
    <>
      <EntitySchema {...args} store={curStore} />
      <StoreDict store={curStore} />
      <StoreRoute store={curStore} />
    </>
  );
});

export interface IEntityProps<V extends object = IAnyObject, R extends object = IAnyObject> extends Omit<EntitySchemaProps<V, R>, 'store'> {
  store: IStore<V, R> | IStoreConfig<V, R>;
}
