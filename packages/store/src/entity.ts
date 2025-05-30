/**
 * @remarks 实体模块，用于管理实体相关的配置和操作
 * @author ickeep <i@ickeep.com>
 * @module entity
 */

import { IAny, IAnyObject, IAPIRequestConfig, IObjKey, IOptions } from '@yimoka/shared';

import { BaseStore } from './base';
import { IFieldsConfig } from './field';

import { IStore, IStoreConfig, opStoreAfterAtFetch } from '.';

/**
 * 获取实体存储实例
 * @param store - 存储实例或配置
 * @param mode - API操作模式
 * @param config - 实体配置
 * @param isOperation - 是否为操作模式
 * @returns 存储实例或配置
 * @remarks 根据不同的操作模式配置存储实例
 */
// eslint-disable-next-line complexity
export function getEntityStore<V extends object = IAnyObject, R extends object = IAnyObject>(store?: IStore<V, R> | IStoreConfig<V, R>, mode?: IAPIKey, config?: IEntityConfig<V>, isOperation?: boolean): IStore<V, R> | IStoreConfig<V, R> {
  if (store instanceof BaseStore) {
    return store;
  }

  const conf: IStoreConfig<IAny, IAny> = {
    fieldsConfig: config?.fieldsConfig,
  };

  const idKey = config?.idKey ?? 'id';
  if (['add', 'edit'].includes(`${mode}`)) {
    conf.afterAtFetch = { ...opStoreAfterAtFetch };
    conf.defaultValues = { ...config?.defaultFormValues };
    // 如果是 edit 添加 idKey
    if (mode === 'edit') {
      if (!(idKey in conf.defaultValues)) {
        conf.defaultValues[idKey] = undefined;
      }
    }
  } else if (['list', 'query'].includes(`${mode}`)) {
    conf.defaultValues = { ...config?.defaultQueryValues };
    conf.type = 'list';
  } else if (['detail'].includes(`${mode}`)) {
    // 默认马上执行 和过滤空值
    if (typeof conf.options === 'undefined') {
      conf.options = {};
    }
    if (typeof conf.options.runNow === 'undefined') {
      conf.options.runNow = 'always';
    }
    if (typeof conf.options.filterBlankAtRun === 'undefined') {
      conf.options.filterBlankAtRun = true;
    }
    conf.defaultValues = { ...config?.defaultDetailValues };

    if (!(idKey in conf.defaultValues)) {
      conf.defaultValues[idKey] = undefined;
    }
  } else if (isOperation) {
    conf.afterAtFetch = { ...opStoreAfterAtFetch };
  }

  const curStore = store ?? {};

  curStore.fieldsConfig = { ...conf.fieldsConfig, ...curStore.fieldsConfig };
  curStore.defaultValues = { ...conf.defaultValues, ...curStore.defaultValues };
  curStore.afterAtFetch = { ...conf.afterAtFetch, ...curStore.afterAtFetch };
  curStore.options = { ...conf.options, ...curStore.options };
  curStore.type = curStore.type ?? conf.type;

  if (!curStore.api && mode) {
    curStore.api = config?.api?.[mode];
  }

  return curStore;
}

/**
 * 实体配置接口
 * @interface IEntityConfig
 * @remarks 定义实体相关的配置项
 * @template V - 实体数据类型
 */
export interface IEntityConfig<V extends object = IAnyObject> {
  /** 实体名称 */
  name?: string;
  /** 实体的唯一标识字段，默认 id */
  idKey?: string;
  /** 批量操作的唯一标识字段，默认 ids */
  idsKey?: string;
  /** 实体的显示字段，默认 name */
  labelKey?: string;
  /** 基础路径 */
  basePath?: string;
  /** 路径配置，如 add: '/add' edit: '/edit' */
  path?: Record<IAPIKey, string>;
  /** 页面的面包屑配置 */
  breadcrumb?: IBreadcrumbItem[];
  /** 字段配置 */
  fieldsConfig?: IFieldsConfig;
  /** 接口配置 */
  api?: Record<IAPIKey, IAPIRequestConfig>;
  /** 字典 map 映射配置，如 status: { 1: '启用', 0: '禁用' } */
  map?: Record<IObjKey, IAnyObject>;
  /** 字典选项配置，如 status: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }] */
  options?: Record<IObjKey, IOptions>;
  /** 表单默认值，用于添加/编辑页面，编辑会多一个 idKey */
  defaultFormValues?: Partial<V>;
  /** 查询默认参数的值，用于列表/查询页面 */
  defaultQueryValues?: Partial<V> & IAnyObject;
  /** 详情默认参数的值，用于详情页面 */
  defaultDetailValues?: IAnyObject;

  [key: IObjKey]: IAny;
}

/**
 * 面包屑项接口
 * @interface IBreadcrumbItem
 * @remarks 定义面包屑导航项的配置
 */
export interface IBreadcrumbItem {
  /** 显示文本 */
  label?: string;
  /** 图标 */
  icon?: string;
  /** 链接地址 */
  href?: string;
  /** 路径 */
  path?: string;
  [key: IObjKey]: IAny;
}

/**
 * API操作模式类型
 * @type IAPIKey
 * @remarks 定义所有可用的API操作模式
 */
export type IAPIKey =
  | 'add' | 'edit' | 'detail' | 'del' | 'delOne'
  | 'list' | 'queryOne' | 'query' | 'count'
  | 'getCache' | 'setCache' | 'delCache'
  | 'enableOne' | 'disableOne' | 'enable' | 'disable'
  | string;
