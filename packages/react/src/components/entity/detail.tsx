import { observer } from '@formily/react';
import { IAnyObject, isVacuous } from '@yimoka/shared';
import { getEntityStore, IEntityConfig, ISchema, IStore, IStoreConfig } from '@yimoka/store';
import { cloneDeep, pick } from 'lodash-es';
import React, { useEffect } from 'react';

import { useDeepMemo } from '../../hooks/deep-memo';
import { useInitStore } from '../../hooks/store';

import { Entity, IEntityProps } from './base';
import { EntityResponse } from './response';

export const EntityDetail = observer((props: IEntityDetailProps) => {
  const { values, ...args } = props;

  if (isVacuous(values)) {
    return <FetchDetail {...args} />;
  }

  return <EntityValues {...args} values={values} />;
});

export const FetchDetail = observer((props: IFetchDetailProps) => {
  const { config, detailStore, scope, ...args } = props;
  const curDetailConfig = useDeepMemo(() => getEntityStore(detailStore, 'detail', config), [detailStore, config]);
  const curDetailStore = useInitStore(curDetailConfig);

  return (
    <Entity store={curDetailStore} >
      <EntityResponse store={curDetailStore}>
        <EntityValues
          {...args}
          config={config}
          scope={{ ...scope, $detailStore: detailStore }}
          values={curDetailStore?.response?.data ?? {}}
        />
      </EntityResponse>
    </Entity>
  );
});

export const EntityValues = observer((props: IEntityValuesProps) => {
  const { config, values, notPickValues, scope, store = {}, ...args } = props;
  const curStore = useInitStore(store);
  const useScope = useDeepMemo(() => ({ $config: config, ...scope }), [config, scope]);

  useEffect(() => {
    const keys = Object.keys(curStore.defaultValues);
    if (notPickValues || keys.length === 0) {
      curStore.setValues(values);
      curStore.defaultValues = cloneDeep(values);
    } else {
      const curValues = pick(values, Object.keys(curStore.defaultValues));
      curStore.setValues(curValues);
      curStore.defaultValues = cloneDeep(curValues);
    }
  }, [curStore, notPickValues, values]);

  return (
    <Entity {...args} scope={useScope} store={curStore} />
  );
});

export type IEntityDetailProps<V extends object = IAnyObject, R extends object = IAnyObject> = Partial<IEntityValuesProps<V, R>> & {
  schema: ISchema;
  detailStore?: IStore<V, R> | IStoreConfig<V, R>;
}

type IFetchDetailProps<V extends object = IAnyObject, R extends object = IAnyObject> = Omit<IEntityValuesProps<V, R>, 'values'> & {
  detailStore?: IStore<V, R> | IStoreConfig<V, R>;
}

export type IEntityValuesProps<V extends object = IAnyObject, R extends object = IAnyObject> = Partial<IEntityProps<V, R>> & {
  config?: IEntityConfig<V>;
  schema: ISchema;
  values: V,
  // 不对传入的 values 根据 store 的默认值进行 pick
  notPickValues?: boolean
}

