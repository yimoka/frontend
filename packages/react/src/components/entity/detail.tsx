import { observer } from '@formily/react';
import { IAnyObject, isVacuous } from '@yimoka/shared';
import { getEntityStore, IEntityConfig, IStore, IStoreConfig } from '@yimoka/store';
import { cloneDeep, omit, pick } from 'lodash-es';
import React, { useEffect, useMemo } from 'react';

import { useDeepMemo } from '../../hooks/deep-memo';
import { useEntityConfig } from '../../hooks/entity-config';
import { useInitStore } from '../../hooks/store';

import { Entity, IEntityProps } from './base';
import { EntityResponse } from './response';

export const EntityDetail = observer((props: IEntityDetailProps) => {
  const { values, store, config, scope, ...args } = props;
  const curConfig = useEntityConfig(config);

  const curStore = useMemo(() => getEntityStore(store, 'detail', curConfig), [curConfig, store]);

  if (isVacuous(values)) {
    return (
      <FetchDetail
        notPickValues
        {...args}
        config={curConfig}
        scope={scope}
        store={curStore}
      />
    );
  }

  return (
    <EntityValues
      notPickValues
      {...args}
      config={curConfig}
      scope={{ ...scope, $detailStore: null }}
      store={curStore}
      values={values}
    />
  );
});

export const FetchDetail = observer((props: IFetchDetailProps) => {
  const { config, detailStore, scope, ...args } = props;
  const curConfig = useEntityConfig(config);

  const curDetailConfig = useDeepMemo(() => {
    const curDetail = detailStore ?? {};
    if (typeof curDetail.options === 'undefined') {
      curDetail.options = {};
    }
    if (typeof curDetail.options.runNow === 'undefined') {
      curDetail.options.runNow = 'always';
    }
    if (typeof curDetail.options.bindRoute === 'undefined') {
      curDetail.options.bindRoute = true;
    }
    return getEntityStore(curDetail, 'detail', curConfig);
  }, [detailStore, curConfig]);

  const curDetailStore = useInitStore(curDetailConfig);

  return (
    <Entity store={curDetailStore} >
      <EntityResponse store={curDetailStore}>
        <EntityValues
          {...args}
          config={curConfig}
          scope={{ ...scope, $detailStore: curDetailStore }}
          values={curDetailStore?.response?.data ?? {}}
        />
      </EntityResponse>
    </Entity>
  );
});

export const EntityValues = observer((props: IEntityValuesProps) => {
  const { config, values, notPickValues, scope, store = {}, omitKeys, ...args } = props;
  const curStore = useInitStore(store);
  const curConfig = useEntityConfig(config);
  const useScope = useDeepMemo(() => ({ $config: curConfig, ...scope }), [curConfig, scope]);

  useEffect(() => {
    const keys = Object.keys(curStore.defaultValues);
    let curValues = omitKeys?.length ? omit(values, omitKeys) : values;
    if (notPickValues || keys.length === 0) {
      curStore.setValues(curValues);
      curStore.defaultValues = cloneDeep(curValues);
    } else {
      curValues = pick(curValues, Object.keys(curStore.defaultValues));
      curStore.setValues(curValues);
      curStore.defaultValues = cloneDeep(curValues);
    }
  }, [curStore, notPickValues, omitKeys, values]);

  return (
    <Entity {...args} scope={useScope} store={curStore} />
  );
});

export type IEntityDetailProps<V extends object = IAnyObject, R extends object = IAnyObject> = Partial<IEntityValuesProps<V, R>> & {
  detailStore?: IStore<V, R> | IStoreConfig<V, R>;
}

type IFetchDetailProps<V extends object = IAnyObject, R extends object = IAnyObject> = Omit<IEntityValuesProps<V, R>, 'values'> & {
  detailStore?: IStore<V, R> | IStoreConfig<V, R>;
}

export type IEntityValuesProps<V extends object = IAnyObject, R extends object = IAnyObject> = Partial<IEntityProps<V, R>> & {
  config?: IEntityConfig<V>;
  values: V,
  // 不对传入的 values 根据 store 的默认值进行 pick
  notPickValues?: boolean
  // 不取传入 values 中这些 key 的值
  omitKeys?: string[]
}

