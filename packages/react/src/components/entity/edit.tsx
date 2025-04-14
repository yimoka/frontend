import { observer } from '@formily/react';
import { IAnyObject, isVacuous } from '@yimoka/shared';
import { getEntityStore, ISchema, IStore, IStoreConfig } from '@yimoka/store';
import React from 'react';

import { useDeepMemo } from '../../hooks/deep-memo';

import { EntityValues, FetchDetail, IEntityValuesProps } from './detail';

export const EntityEdit = observer((props: IEntityEditProps) => {
  const { values, store, config, ...args } = props;

  const editStore = useDeepMemo(() => getEntityStore(store, 'edit', config), [store, config]);

  if (isVacuous(values)) {
    return <FetchDetail {...args} config={config} store={editStore} />;
  }

  return (
    <EntityValues
      {...args}
      config={config}
      store={editStore}
      values={values}
    />
  );
});

export type IEntityEditProps<V extends object = IAnyObject, R extends object = IAnyObject> = Partial<IEntityValuesProps<V, R>> & {
  schema: ISchema;
  detailStore?: IStore<V, R> | IStoreConfig<V, R>;
}
