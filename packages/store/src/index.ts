/**
 * @remarks 存储模块的入口文件，导出所有核心类型和类
 * @author ickeep <i@ickeep.com>
 * @module @yimoka/store
 */

import { IAny, IAnyObject } from '@yimoka/shared';

import { BaseStore, IBaseStoreConfig } from './base';
import { ListStore } from './list';

// 导出所有子模块
export * from './aop';
export * from './api';
export * from './base';
export * from './dict';
export * from './entity';
export * from './field';
export * from './list';
export * from './notifier';
export * from './root';
export * from './schema';

/**
 * 存储类型
 * @remarks 支持基础存储和列表存储两种类型
 */
export type IStoreType = 'base' | 'list';

/**
 * 存储实例类型
 * @template V - 值的类型
 * @template R - 响应的类型
 * @remarks 存储实例可以是基础存储或列表存储
 * @example
 * ```ts
 * // 基础存储
 * const baseStore: IStore = new BaseStore();
 *
 * // 列表存储
 * const listStore: IStore = new ListStore();
 * ```
 */
export type IStore<V extends object = IAnyObject, R = IAny> = BaseStore<V, R> | ListStore<V, R>;

/**
 * 存储配置类型
 * @template V - 值的类型
 * @template R - 响应的类型
 * @remarks 存储配置包含类型和基础配置
 * @example
 * ```ts
 * const config: IStoreConfig = {
 *   type: 'list',
 *   defaultValues: { page: 1, size: 10 },
 *   api: { url: '/api/users' }
 * };
 * ```
 */
export type IStoreConfig<V extends object = IAnyObject, R = IAny> = { type?: IStoreType } & (IBaseStoreConfig<V, R>);

/**
 * 存储类型映射
 * @remarks 将存储类型映射到对应的存储类
 * @example
 * ```ts
 * const Store = StoreMap[config.type || 'base'];
 * const store = new Store(config);
 * ```
 */
export const StoreMap = {
  base: BaseStore,
  list: ListStore,
};
