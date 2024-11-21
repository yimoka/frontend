import { IAny, IAnyObject, IAPIRequestConfig, IOptions } from '@yimoka/shared';

import { IStoreAPI, IStoreResponse } from './api';
import { IField } from './field';

export type IStoreDict<V extends object = IAnyObject> = { [key in IField<V>]?: IAny };

export type IStoreDictLoading<V extends object = IAnyObject> = { [key in IField<V>]?: boolean };

export type IStoreDictConfig<V extends object = IAnyObject> = Array<IDictConfigItem<V>>;

export type IDictConfigItem<V extends object = IAnyObject> = {
  field: IField<V>,
  isApiOptionsToMap?: boolean
  toMapKeys?: { value?: string, label?: string }
} & ({
  type?: 'self'
  data?: IOptions | IAny,
  api?: IAPIRequestConfig | (() => Promise<IStoreResponse>)
} | IDictConfigItemBy<V>);

export interface IDictConfigItemBy<V extends object = IAnyObject> {
  field: IField<V>,
  type: 'by'
  byField: IField<V> | IField<V>[], // 添加支持多字段联动
  getData?: (value: IAny) => IOptions | IAny
  api?: IStoreAPI
  paramKey?: string
  isUpdateValue?: boolean
  isEmptyGetData?: boolean
}
