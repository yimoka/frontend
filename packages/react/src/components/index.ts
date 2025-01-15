import { IAny } from '@yimoka/shared';
import { ComponentType } from 'react';

import { SchemaItemRecursion } from './array/schema-item-recursion';
import { SchemaItemRender } from './array/schema-item-render';
import { EntityAdd } from './entity/add';
import { Entity } from './entity/base';
import { EntityDetail } from './entity/detail';
import { EntityEdit } from './entity/edit';
import { EntityList } from './entity/list';
import { EntityOperation } from './entity/operation';
import { EntityResponse } from './entity/response';
import { EntitySchema } from './entity/schema';
import { RenderAny } from './render-any';
import { StoreDict } from './store/dict';
import { StoreRoute } from './store/route';
import { Trigger } from './trigger';

export const components: Record<string, ComponentType<IAny>> = {
  SchemaItemRecursion,
  SchemaItemRender,

  EntityAdd,
  Entity,
  EntityDetail,
  EntityEdit,
  EntityList,
  EntityOperation,
  EntityResponse,
  EntitySchema,

  StoreDict,
  StoreRoute,

  RenderAny,
  Trigger,
};
