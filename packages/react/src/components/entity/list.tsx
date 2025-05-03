import { observer } from '@formily/react';
import { IAnyObject } from '@yimoka/shared';
import { getEntityStore, IEntityConfig } from '@yimoka/store';
import React from 'react';

import { useDeepMemo } from '../../hooks/deep-memo';
import { useEntityConfig } from '../../hooks/entity-config';

import { Entity, IEntityProps } from './base';

export const EntityList = observer((props: IEntityListProps) => {
  const { config, store, scope, ...args } = props;
  const curConfig = useEntityConfig(config);

  const curStore = useDeepMemo(() => getEntityStore(store, 'list', curConfig), [store, curConfig]);

  const useScope = useDeepMemo(() => ({ $config: curConfig, ...scope }), [curConfig, scope]);

  return <Entity {...args} scope={useScope} store={curStore} />;
});

export type IEntityListProps<V extends object = IAnyObject, R extends object = IAnyObject> = Partial<IEntityProps<V, R>> & {
  config?: IEntityConfig<V>;
}
