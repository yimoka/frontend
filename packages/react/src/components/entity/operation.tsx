import { observer } from '@formily/react';
import { IAnyObject } from '@yimoka/shared';
import { getEntityStore, IAPIKey, IEntityConfig, ISchema } from '@yimoka/store';
import React from 'react';

import { useDeepMemo } from '../../hooks/deep-memo';

import { Entity, IEntityProps } from './base';

export const EntityOperation = observer((props: IEntityOpProps) => {
  const { config, store, scope, operation, ...args } = props;

  const curStore = useDeepMemo(() => getEntityStore(store, operation, config, true), [store, config]);

  const useScope = useDeepMemo(() => ({ $config: config, ...scope }), [config, scope]);

  return <Entity {...args} scope={useScope} store={curStore} />;
});

export type IEntityOpProps<V extends object = IAnyObject, R extends object = IAnyObject> = Partial<IEntityProps<V, R>> & {
  config?: IEntityConfig<V>;
  schema: ISchema;
  operation?: IAPIKey;
}
