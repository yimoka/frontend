import { observer } from '@formily/react';
import { isVacuous } from '@yimoka/shared';
import { getEntityStore } from '@yimoka/store';
import { cloneDeep } from 'lodash-es';
import React from 'react';

import { useDeepMemo } from '../../hooks/deep-memo';

import { useEntityConfig } from '../../hooks/entity-config';

import { IEntityAddProps } from './add';
import { Entity } from './base';

export const EntityBatchAdd = observer((props: IEntityAddProps) => {
  const { config, store, scope, defaultValues = { data: [] }, schema, ...args } = props;
  const curConfig = useEntityConfig(config);

  const curStore = useDeepMemo(() => {
    if (!isVacuous(defaultValues)) {
      if (!store) {
        return getEntityStore({ defaultValues }, 'batchAdd', curConfig);
      }
      store.defaultValues = { ...store.defaultValues, ...cloneDeep(defaultValues) };
    }
    return getEntityStore(store, 'batchAdd', curConfig);
  }, [store, curConfig, defaultValues]);

  const curScope = useDeepMemo(() => ({ $config: curConfig, ...scope }), [curConfig, scope]);

  // 如果 schema 不存在  则使用默认的 schema
  const curSchema = useDeepMemo(() => schema ?? {
    type: 'object',
    properties: {
      form: {
        type: 'void',
        'x-component': 'StoreForm',
        properties: {
          data: {
            type: 'array',
            'x-component': 'JSONEditor',
          },
        },
      },
    },
  }, [schema]);

  return (
    <Entity
      {...args}
      schema={curSchema}
      scope={curScope}
      store={curStore}
    />
  );
});
