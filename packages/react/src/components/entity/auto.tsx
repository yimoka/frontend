import { observer } from '@formily/react';
import { IAnyObject } from '@yimoka/shared';
import React, { ComponentType } from 'react';

import { EntityAdd, IEntityAddProps } from './add';
import { EntityDetail, IEntityDetailProps } from './detail';
import { EntityEdit, IEntityEditProps } from './edit';
import { EntityList, IEntityListProps } from './list';
import { EntityOperation, IEntityOpProps } from './operation';

const EntityMap: Record<string, ComponentType<IAnyObject>> = {
  add: EntityAdd,
  edit: EntityEdit,
  detail: EntityDetail,
  list: EntityList,
};

export const EntityAuto = observer((props: IEntityAutoProps) => {
  const { type, ...args } = props;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const Entity = type ? (EntityMap[type] ?? EntityOperation) : EntityOperation;

  return <Entity {...args} />;
});

export type IEntityAutoProps<V extends object = IAnyObject, R extends object = IAnyObject> =
  | ({ type: 'add' } & IEntityAddProps<V, R>)
  | ({ type: 'edit' } & IEntityEditProps<V, R>)
  | ({ type: 'detail' } & IEntityDetailProps<V, R>)
  | ({ type: 'list' } & IEntityListProps<V, R>)
  | ({ type?: string } & IEntityOpProps<V, R>)
