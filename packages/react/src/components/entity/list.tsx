import { ISchema, observer } from '@formily/react';
import { IAnyObject } from '@yimoka/shared';
import { getEntryStore, IEntityConfig } from '@yimoka/store';

import { useDeepMemo } from '../../hooks/deep-memo';

import { Entity, IEntityProps } from './base';

export const EntityList = observer((props: IEntityListProps) => {
  const { config, store, scope, ...args } = props;

  const curStore = useDeepMemo(() => getEntryStore(store, 'list', config), [store, config]);

  const useScope = useDeepMemo(() => ({ $config: config, ...scope }), [config, scope]);

  return <Entity {...args} store={curStore} scope={useScope} />;
});

export type IEntityListProps<V extends object = IAnyObject, R extends object = IAnyObject> = Partial<IEntityProps<V, R>> & {
  config?: IEntityConfig<V>;
  schema: ISchema;
}