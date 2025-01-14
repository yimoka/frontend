import { IAny, IAnyObject, IAPIRequestConfig, IObjKey, IOptions } from '@yimoka/shared';

import { BaseStore } from './base';
import { IFieldsConfig } from './field';

import { IStore, IStoreConfig, opStoreAfterAtFetch } from '.';

// eslint-disable-next-line complexity
export function getEntryStore<V extends object = IAnyObject, R extends object = IAnyObject>(store?: IStore<V, R> | IStoreConfig<V, R>, mode?: IAPIKey, config?: IEntityConfig<V>, isOperation?: boolean): IStore<V, R> | IStoreConfig<V, R> {
  if (store instanceof BaseStore) {
    return store;
  }

  const conf: IStoreConfig<IAny, IAny> = {
    fieldsConfig: config?.fieldsConfig,
  };

  if (['add', 'edit'].includes(`${mode}`)) {
    conf.afterAtFetch = { ...opStoreAfterAtFetch };
    conf.defaultValues = { ...config?.defaultFormValues };
  } else if (['list', 'query'].includes(`${mode}`)) {
    conf.defaultValues = { ...config?.defaultQueryValues };
    conf.type = 'list';
  } else if (['detail'].includes(`${mode}`)) {
    conf.defaultValues = { ...config?.defaultDetailValues };
    if (config?.idKey) {
      conf.defaultValues[config.idKey] = undefined;
    }
  } else if (isOperation) {
    conf.afterAtFetch = { ...opStoreAfterAtFetch };
  }

  const curStore = store ?? {} as IStoreConfig<V, R>;

  curStore.fieldsConfig = { ...conf.fieldsConfig, ...curStore.fieldsConfig };
  curStore.defaultValues = { ...conf.defaultValues, ...curStore.defaultValues };
  curStore.afterAtFetch = { ...conf.afterAtFetch, ...curStore.afterAtFetch };
  curStore.type = curStore.type ?? conf.type;

  if (!curStore.api && mode) {
    curStore.api = config?.api?.[mode];
  }

  return curStore;
}

export interface IEntityConfig<V extends object = IAnyObject> {
  // 实体名称
  name?: string;
  // 实体的唯一标识字段 默认 id
  idKey?: string;
  // 批量操作的唯一标识字段 默认 ids
  idsKey?: string;
  // 实体的显示字段 默认 name
  labelKey?: string;
  // 基础路径
  basePath?: string
  // 路径配置 如 add: '/add' edit: '/edit'
  path?: Record<IAPIKey, string>
  // 页面的面包屑配置
  breadcrumb?: IBreadcrumbItem[]
  // 字段配置
  fieldsConfig?: IFieldsConfig
  // 接口配置
  api?: Record<IAPIKey, IAPIRequestConfig>
  // 字典 map 映射配置 如 status: { 1: '启用', 0: '禁用' }
  map?: Record<IObjKey, IAnyObject>
  // 字典选项配置 如 status: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }]
  options?: Record<IObjKey, IOptions>
  // 表单默认值 用于添加/编辑页面 编辑会多一个 idKey
  defaultFormValues?: Partial<V>
  // 查询默认参数的值 用于列表/查询页面
  defaultQueryValues?: Partial<V> & IAnyObject
  // 详情默认参数的值 用于详情页面
  defaultDetailValues?: IAnyObject

  [key: IObjKey]: IAny;
}

export interface IBreadcrumbItem {
  label?: string;
  icon?: string;
  url?: string;
  [key: IObjKey]: IAny;
}

export type IAPIKey =
  'add' | 'edit' | 'detail' | 'del' | 'delOne'
  | 'list' | 'queryOne' | 'query' | 'count'
  | 'getCache' | 'setCache' | 'delCache'
  | 'enableOne' | 'disableOne' | 'enable' | 'disable'
  | string;
