import { observer } from '@formily/react';
import { IAnyObject } from '@yimoka/shared';
import { IStore, IStoreConfig } from '@yimoka/store';

import { useStore } from '../../hooks/store';
import { StoreDict } from '../store/dict';
import { StoreRoute } from '../store/route';

import { EntitySchema, EntitySchemaProps } from './schema';

export const Entity = observer((props: EntityProps) => {
  const { store, ...args } = props;
  const curStore = useStore(store);
  return (
    <>
      <EntitySchema {...args} store={curStore} />
      <StoreDict store={curStore} />
      <StoreRoute store={curStore} />
    </>
  );
});

export interface EntityProps<V extends object = IAnyObject, R extends object = IAnyObject> extends Omit<EntitySchemaProps<V, R>, 'store'> {
  store: IStore<V, R> | IStoreConfig<V, R>;
}
