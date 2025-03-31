import { observer } from '@formily/react';
import { IAnyObject } from '@yimoka/shared';
import { getEntityStore, IEntityConfig, ISchema } from '@yimoka/store';
import React from 'react';

import { useDeepMemo } from '../../hooks/deep-memo';

import { Entity, IEntityProps } from './base';

export const EntityList = observer((props: IEntityListProps) => {
  const { config, store, scope, ...args } = props;

  const curStore = useDeepMemo(() => getEntityStore(store, 'list', config), [store, config]);

  const useScope = useDeepMemo(() => ({ $config: config, ...scope }), [config, scope]);

  return <Entity {...args} scope={useScope} store={curStore} />;
});

export type IEntityListProps<V extends object = IAnyObject, R extends object = IAnyObject> = Partial<IEntityProps<V, R>> & {
  config?: IEntityConfig<V>;
  schema: ISchema;
}
