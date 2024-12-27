import { IAnyObject } from '@yimoka/shared';

import { BaseStore, IBaseStoreConfig } from './base';
import { ListStore } from './list';

export * from './aop';
export * from './api';
export * from './base';
export * from './dict';
export * from './entity';
export * from './field';
export * from './list';
export * from './notifier';
export * from './root';

export type IStoreType = 'base' | 'list';

export type IStore<V extends object = IAnyObject, R extends object = IAnyObject> = BaseStore<V, R> | ListStore<V, R>

export type IStoreConfig<V extends object = IAnyObject, R extends object = IAnyObject> = { type?: IStoreType } & (IBaseStoreConfig<V, R>);

export const StoreMap = {
  base: BaseStore,
  list: ListStore,
};
