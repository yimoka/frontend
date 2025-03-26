import { observer } from '@formily/react';
import { IAnyObject, isBlank } from '@yimoka/shared';
import { getEntryStore, ISchema, IStore, IStoreConfig } from '@yimoka/store';
import React from 'react';

import { useDeepMemo } from '../../hooks/deep-memo';

import { EntityValues, FetchDetail, IEntityValuesProps } from './detail';

export const EntityEdit = observer((props: IEntityEditProps) => {
  const { values, store, config, ...args } = props;

  const editStore = useDeepMemo(() => getEntryStore(store, 'edit', config), [store, config]);

  if (isBlank(values)) {
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
