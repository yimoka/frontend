import { observer } from '@formily/react';
import { IAnyObject, isVacuous } from '@yimoka/shared';
import { getEntityStore, IStore, IStoreConfig } from '@yimoka/store';
import React from 'react';

import { useDeepMemo } from '../../hooks/deep-memo';
import { useEntityConfig } from '../../hooks/entity-config';

import { EntityValues, FetchDetail, IEntityValuesProps } from './detail';

export const EntityEdit = observer((props: IEntityEditProps) => {
  const { values, store, config, scope, ...args } = props;
  const curConfig = useEntityConfig(config);

  const editStore = useDeepMemo(() => getEntityStore(store, 'edit', curConfig), [store, curConfig]);

  if (isVacuous(values)) {
    return <FetchDetail {...args}
      config={curConfig}
      scope={scope}
      store={editStore} />;
  }

  return (
    <EntityValues
      {...args}
      config={curConfig}
      scope={{ ...scope, $editStore: null }}
      store={editStore}
      values={values}
    />
  );
});

export type IEntityEditProps<V extends object = IAnyObject, R extends object = IAnyObject> = Partial<IEntityValuesProps<V, R>> & {
  detailStore?: IStore<V, R> | IStoreConfig<V, R>;
}
