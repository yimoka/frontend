import { observer } from '@formily/react';
import { IAnyObject, isBlank } from '@yimoka/shared';
import { getEntityStore, IEntityConfig, ISchema } from '@yimoka/store';
import { cloneDeep } from 'lodash-es';
import React from 'react';

import { useDeepMemo } from '../../hooks/deep-memo';

import { Entity, IEntityProps } from './base';

export const EntityAdd = observer((props: IEntityAddProps) => {
  const { config, store, scope, defaultValues, ...args } = props;

  const curStore = useDeepMemo(() => {
    if (!isBlank(defaultValues)) {
      if (!store) {
        return getEntityStore({ defaultValues }, 'add', config);
      }
      store.defaultValues = { ...store.defaultValues, ...cloneDeep(defaultValues) };
    }
    return getEntityStore(store, 'add', config);
  }, [store, config, defaultValues]);


  const useScope = useDeepMemo(() => ({ $config: config, ...scope }), [config, scope]);

  return <Entity {...args} scope={useScope} store={curStore} />;
});

export type IEntityAddProps<V extends object = IAnyObject, R extends object = IAnyObject> = Partial<IEntityProps<V, R>> & {
  defaultValues?: IAnyObject;
  config?: IEntityConfig<V>;
  schema: ISchema;
}
