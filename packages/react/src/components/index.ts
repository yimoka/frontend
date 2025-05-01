import { IAny } from '@yimoka/shared';
import { ComponentType } from 'react';

import { RenderArray } from './array/render-array';
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
import { FetchData } from './fetch-data';
import { ReFormByListData, ReFormProvider } from './re-form-provider';
import { RenderAny } from './render-any';
import { StoreDict } from './store/dict';
import { StoreRoute } from './store/route';
import { WatchChildStore } from './store/watchChildStore';
import { Trigger } from './trigger';

export const components: Record<string, ComponentType<IAny>> = {
  RenderArray,
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
  WatchChildStore,

  FetchData,
  ReFormProvider,
  ReFormByListData,
  RenderAny,
  Trigger,
};
