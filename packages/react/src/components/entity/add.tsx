import { observer } from '@formily/react';
import { IAnyObject, isVacuous } from '@yimoka/shared';
import { getEntityStore, IEntityConfig } from '@yimoka/store';
import { cloneDeep } from 'lodash-es';
import React from 'react';

import { useDeepMemo } from '../../hooks/deep-memo';
import { useEntityConfig } from '../../hooks/entity-config';

import { Entity, IEntityProps } from './base';

export const EntityAdd = observer((props: IEntityAddProps) => {
  const { config, store, scope, defaultValues, ...args } = props;
  const curConfig = useEntityConfig(config);

  const curStore = useDeepMemo(() => {
    if (!isVacuous(defaultValues)) {
      if (!store) {
        return getEntityStore({ defaultValues }, 'add', curConfig);
      }
      store.defaultValues = { ...store.defaultValues, ...cloneDeep(defaultValues) };
    }
    return getEntityStore(store, 'add', curConfig);
  }, [store, curConfig, defaultValues]);


  const useScope = useDeepMemo(() => ({ $config: curConfig, ...scope }), [curConfig, scope]);

  return <Entity {...args} scope={useScope} store={curStore} />;
});

export type IEntityAddProps<V extends object = IAnyObject, R extends object = IAnyObject> = Partial<IEntityProps<V, R>> & {
  defaultValues?: IAnyObject;
  config?: IEntityConfig<V>;
}
