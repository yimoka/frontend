import { observer } from '@formily/react';
import { IAnyObject } from '@yimoka/shared';
import { getEntityStore, IAPIKey, IEntityConfig, ISchema } from '@yimoka/store';
import React from 'react';

import { useDeepMemo } from '../../hooks/deep-memo';
import { useEntityConfig } from '../../hooks/entity-config';

import { Entity, IEntityProps } from './base';

export const EntityOperation = observer((props: IEntityOpProps) => {
  const { config, store, scope, operation, ...args } = props;
  const curConfig = useEntityConfig(config);

  const curStore = useDeepMemo(() => getEntityStore(store, operation, curConfig, true), [store, curConfig]);

  const useScope = useDeepMemo(() => ({ $config: curConfig, ...scope }), [curConfig, scope]);

  return <Entity {...args} scope={useScope} store={curStore} />;
});

export type IEntityOpProps<V extends object = IAnyObject, R extends object = IAnyObject> = Partial<IEntityProps<V, R>> & {
  config?: IEntityConfig<V>;
  schema?: ISchema;
  operation?: IAPIKey;
}
