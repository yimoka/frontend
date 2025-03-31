import { createForm, Form, IFormMergeStrategy, IFormProps } from '@formily/core';
import { action, define, observable } from '@formily/reactive';
import { addWithLimit, IAny, IAnyObject, IObjKey, isBlank, isSuccess, mergeWithArrayOverride } from '@yimoka/shared';
import { cloneDeep, get, pick, pickBy, PropertyPath, set } from 'lodash-es';

import { handleAfterAtFetch, IAfterAtFetch as IAfterAtFetch } from './aop';
import { IStoreAPI, IStoreHTTPRequest, IStoreResponse, runAPI } from './api';
import { IStoreDict, IStoreDictConfig, IStoreDictLoading } from './dict';
import { valueToSearchParam, parseSearchParam, IField, IFieldsConfig } from './field';
import { INotifier } from './notifier';

import { IStore } from '.';

const DF_OPTIONS: IBaseStoreOptions = {
  filterBlankAtRun: false,
  bindRoute: false,
  updateRouteType: 'push',
  routeTrigger: 'unequal',
  runNow: false,
  urlWithDefaultFields: [] as string[],
  keys: {},
};

// 事件名称
export const EVENT_NAMES = {
  fetchSuccess: 'fetchSuccess',
  fetchError: 'fetchError',
};

/**
 * 基础业务数据管理类。
 *
 * @template V - 值的类型。
 * @template R - 响应的类型。
 * @example
 * ```ts
 * import { BaseStore } from '@yimoka/store';
 *
 * const store = new BaseStore({
 *  defaultValues: {
 *   name: '张三',
 *   age: 18,
 * }
 * });
 * ```
 */
export class BaseStore<V extends object = IAnyObject, R = IAny> {
  options: IBaseStoreOptions = cloneDeep(DF_OPTIONS);

  /**
   * 字段配置对象，用于配置字段的 schema。
   * @type {IFieldsConfig<V>}
   * @default {}
   * fieldsConfig 是一个 IFieldsConfig 类型的对象，用于配置字段。默认值是一个空对象。
   */
  fieldsConfig: IFieldsConfig = Object({});

  /**
   * 默认值对象，包含类型 V 和 IAnyObject 的属性。
   *
   * @type {V & IAnyObject}
   */
  defaultValues: V & IAnyObject;

  /**
   * 表单对象，包含表单的所有字段和方法。来源于 `@formily/core` 的 createForm 方法。
   * @type {Form<V & IAnyObject>}
   */
  form: Form<(V & IAnyObject) | IAnyObject>;

  /**
   * dictConfig 数据字典的配置,按字段配置，支持直接写数据或者配置 API 请求。
   * @type {IStoreDictConfig<V>}
   */
  dictConfig: IStoreDictConfig<V> = [];
  /**
   * 字典请求的加载状态。
   * @type {IStoreDictLoading<V>}
   */
  dictLoading: IStoreDictLoading<V> = {};


  /**
   * 字典数据 用于存储 dictConfig 中配置生成的数据。主要用于下拉框 tag 等数据源。
   * @type {IStoreDict<V>}
   */
  dict: IStoreDict<V> = {};

  /**
   * 扩展数据 用于存储一些额外的数据 可以通过 setExtInfo 方法设置
   * @type {IAnyObject}
   */
  extInfo: IAnyObject = {};

  /**
   * 请求执行器 用于执行请求
   * @type {IStoreHTTPRequest<R, V | IAnyObject>}
  */
  apiExecutor?: IStoreHTTPRequest<R, V | IAnyObject>;

  /**
   * 请求 API 的配置 支持 函数或者配置对象（参考 axios 请求配置）
   * @type {IStoreAPI<V, R>}
   * @example
   * ```ts
   * import { BaseStore } from '@yimoka/store';
   * const store = new BaseStore({
   * api: {url: '/api/user', method: 'GET'}
   * });
   * ```
   * @example
   * ```ts
   * import { BaseStore } from '@yimoka/store';
   * const store = new BaseStore({
   * api: (params) => fetch('/api/user', {method: 'GET', body: JSON.stringify(params)})
   * });
   * ```
   *
  */
  api?: IStoreAPI<V, R>;
  /**
   * 请求加载状态
   * @type {boolean}
   */
  loading = false;
  /**
   * 请求响应数据
   * @type {IStoreResponse<R, V>}
   */
  response: IStoreResponse<R, V> = {};


  /**
  * 通知器 用于通知消息的方法
  * @type {INotifier}
  */
  notifier?: INotifier;

  /**
   * 请求后的操作配置
   * @type {IAfterAtFetch}
   */
  afterAtFetch: IAfterAtFetch = {};

  /**
   * 事件监听器。
   * @private
   */
  private eventListeners: Record<string, Array<(...args: IAny[]) => void>> = {};
  /**
   * 字典请求时序 ID
   */
  private dictFetchIDMap: Record<IObjKey, number> = {};

  /**
   * 最后一次请求的 ID，请求时序保护。
   * @private
   */
  private lastFetchID = 0;
  /**
   * 请求控制器 用于取消请求
   * @type {AbortController}
   * @private
  */
  private apiController: AbortController | undefined;
  /**
   * 选项对象，包含默认选项。
   * @type {IBaseStoreOptions}
   */

  constructor(config: IBaseStoreConfig<V, R> = {}) {
    const { defaultValues = {}, dictConfig, apiExecutor, api, options, extInfo, formConfig, fieldsConfig, defineConfig, notifier, afterAtFetch } = config;
    this.defaultValues = defaultValues as V & IAnyObject;
    if (fieldsConfig) {
      this.fieldsConfig = fieldsConfig;
    }
    this.dictConfig = dictConfig || [];
    this.apiExecutor = apiExecutor;
    this.api = api;
    this.extInfo = extInfo || {};
    this.options = mergeWithArrayOverride(this.options, options);
    this.form = createForm({ ...formConfig, initialValues: defaultValues });
    this.notifier = notifier;
    if (afterAtFetch) {
      this.afterAtFetch = afterAtFetch;
    }

    define(this, {
      dict: observable,
      dictConfig: observable, // 以支持设置和重置时及时更新
      dictLoading: observable,
      response: observable.shallow,
      loading: observable,
      extInfo: observable,

      setDict: action,
      setFieldDictLoading: action,
      setFieldDict: action,
      setLoading: action,
      setResponse: action,
      setExtInfo: action,
      fetch: action,
      ...defineConfig,
    });

    const { runNow, bindRoute } = this.options;
    // 绑定路由时，会使用组件在进行页面时进行参数赋值，再进行请求。
    if (runNow && !bindRoute) {
      this.fetch();
    }
  }

  /**
   * 当前表单的值
   *
   * @type {V & IAnyObject}
   */
  get values() {
    return this.form.values;
  }

  /**
   * 获取默认值的深拷贝。
   *
   * @returns 返回一个包含默认值的深拷贝对象。
   */
  getDefaultValues = () => cloneDeep(this.defaultValues);

  /**
   * 设置表单的值。
   *
   * @param values - 部分或全部的表单值。
   * @param strategy - （可选）合并策略，指定如何将新值与现有值合并。 'overwrite' | 'merge' | 'shallowMerge'; 默认为 'merge'。
   *
   * @example
   * // 示例1：设置表单的值 默认策略 merge
   * ```ts
   * const store = new BaseStore({ defaultValues: { name: '张三', age: 18 } });
   * store.setValues({ name: '张三' });
   * console.log(store.values); // { name: '张三', age: 18 }
   * ```
   * @example
   * // 示例2：设置表单值 overwrite
   * ```ts
   * const store = new BaseStore({ defaultValues: { name: '张三', age: 18 } });
   * store.setValues({ name: '张三' }, 'overwrite');
   * console.log(store.values); // { name: '张三' }
   * ```
   * @example
   * // 示例3：设置表单值 shallowMerge
   * ```ts
   * const store = new BaseStore({ defaultValues: { name: '张三', age: 18, info: { address: '北京' } } });
   * store.setValues({ name: '李四', info: { phone: '123' } }, 'shallowMerge');
   * console.log(store.values); // { name: '李四', age: 18, info: { phone: '123' } }
   * ```
   */
  setValues = (values: Partial<V>, strategy?: IFormMergeStrategy) => {
    this.form.setValues(values, strategy);
  };

  /**
   * 设置指定字段的值。
   *
   * @param field 要设置值的字段。
   * @param value 要设置的值。
   *
   * @example
   * 示例1：设置指定字段的值。
  * ```ts
   * const store = new BaseStore({ defaultValues: { name: '张三', age: 18 } });
   * store.setFieldValue("name", '李四');
   * console.log(store.values); // { name: '李四', age: 18 }
   * ```
   * @example
   * ```ts
   * 示例2：设置指定字段的值多级字段。
   * const store = new BaseStore({ defaultValues: { name: '张三', age: 18, info: { address: '北京' } } });
   * store.setFieldValue("info.address", '上海');
   * console.log(store.values); // { name: '张三', age: 18, info: { address: '上海' } }
   * ```
   * @example
   * 示例3：设置指定字段的值多级数组字段。
   * ```ts
   * const store = new BaseStore({ defaultValues: { name: '张三', age: 18, tags: ['a', 'b'] } });
   * store.setFieldValue("tags[0]", 'c');
   * console.log(store.values); // { name: '张三', age: 18, tags: ['c', 'b'] }
   * ```
   */
  setFieldValue = (field: IField<V> | IObjKey, value: IAny) => {
    this.form.setValuesIn(field as IAny, value);
  };

  /**
   * 根据路由中的查询参数和路径参数设置值。
   *
   * @param search - 查询参数，可以是查询字符串或对象。
   * @param params - 路径参数对象，可选。
   * @param resetMissingValues - 是否重置缺失的值，默认为 true。
  * @example
  * // 示例1：从路由查询参数设置值
  * ```ts
  * const store = new BaseStore({ defaultValues: { name: '张三', age: 18 } });
  * store.setValuesFromRoute('?name=李四&age=20');
  * console.log(store.values); // { name: '李四', age: 20 }
  * ```
  * @example
  * // 示例2：从路由查询参数和路径参数设置值
  * ```ts
  * const store = new BaseStore({ defaultValues: { name: '张三', age: 18 } });
  * store.setValuesFromRoute('?name=李四', { age: 20 });
  * console.log(store.values); // { name: '李四', age: 20 }
  * ```
  * @example
  * // 示例3：从对象查询参数设置值 不重置缺失的值
  * ```ts
  * const store = new BaseStore({ defaultValues: { name: '张三', age: 18 } });
  * store.setValuesFromRoute({ name: '李四', age: 20 });
  * console.log(store.values); // { name: '李四', age: 20 }
  * // 不重置缺失的值
  * store.setValuesFromRoute({ name: '李四' }, {}, false);
  * console.log(store.values); // { name: '李四', age: 20 }
  * // 重置缺失的值
  * store.setValuesFromRoute({ name: '李四' }, {}, true);
  * console.log(store.values); // { name: '李四', age: 18 }
  * ```
   */
  setValuesFromRoute = (
    search?: string | IAnyObject,
    params?: IAnyObject,
    resetMissingValues = true,
  ) => {
    let newValues: IAnyObject = {};
    const keys = Object.keys(this.values);
    if (typeof search === 'string' && search) {
      try {
        // 小程序会报错
        const searchParams = new URLSearchParams(search);
        keys.forEach((key) => {
          const strValue = searchParams.get(key);
          if (strValue !== null) {
            newValues[key] = parseSearchParam(
              strValue,
              this.fieldsConfig[key],
              this.defaultValues[key],
            );
          }
        });
      } catch (error) {
        console.error('setValuesFromRoute error:', error);
      }
    }
    if (typeof search === 'object') {
      Object.entries(pick(search, keys)).forEach(([key, value]) => {
        newValues[key] = parseSearchParam(
          value,
          this.fieldsConfig[key],
          this.defaultValues[key],
        );
      });
    }
    if (typeof params === 'object') {
      Object.entries(pick(params, keys)).forEach(([key, value]) => {
        newValues[key] = parseSearchParam(
          value,
          this.fieldsConfig[key],
          this.defaultValues[key],
        );
      });
    }
    if (resetMissingValues) {
      newValues = { ...this.getDefaultValues(), ...newValues };
    }
    this.setValues(newValues);
  };

  /**
   * 重置表单的值为默认值。
  */
  resetValues = () => {
    this.form.setValues(this.getDefaultValues(), 'overwrite');
  };

  /**
   * 重置指定字段的值为默认值。
   * @param fields - 要重置的字段。支持单个字段或多字段数组。
   * 如果重置的字段在默认值中不存在，则不会重置。
   *
   */
  resetFieldsValue = (fields: Array<IField<V> | IObjKey> | IField<V> | IObjKey) => {
    this.setValues(pick(this.getDefaultValues(), fields));
  };

  /**
   * 根据表单的值生成 URL search 字符串。
   */
  genURLSearch = () => {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(this.values).forEach(([key, value]) => {
        const defaultValue = this.defaultValues[key];
        if ((value !== defaultValue || this.options.urlWithDefaultFields?.includes(key)) && (!isBlank(value) || !isBlank(defaultValue))) {
          const str = valueToSearchParam(value);
          searchParams.append(key, str);
        }
      });
      return searchParams.toString();
    } catch (error) {
      console.error('getURLSearch error:', error);
      return '';
    }
  };

  /**
   * 增加字典请求时序 ID。
   */
  incrDictFetchID = (field: IField<V> | IObjKey) => {
    const fetchID = addWithLimit(this.dictFetchIDMap[field] ?? 0);
    this.dictFetchIDMap[field] = fetchID;
    return fetchID;
  };

  /**
   * 获取字典请求时序 ID。
   */
  getDictFetchID = (field: IField<V> | IObjKey) => this.dictFetchIDMap[field] ?? 0;

  /**
   * 设置字典数据。
   * @param dict - 字典数据。
   */
  setDict = (dict: IStoreDict<V>) => this.dict = dict;

  /**
   * 设置字段字典数据。
   * @param field - 字段。
   * @param value - 字典数据。
   */
  setFieldDict = (field: IField<V> | IObjKey, value: IAny) => set(this.dict, field, value);

  /**
   * 设置字段字典加载状态。
   * @param field - 字段。
   * @param bool - 加载状态 true | false。
   */
  setFieldDictLoading = (field: IField<V> | IObjKey, bool: boolean) => this.dictLoading[field] = bool;

  /**
   * 设置 fetch 的加载状态。
   */
  setLoading = (loading: boolean) => this.loading = loading;

  /**
   * 设置 fetch 的响应数据
   */
  setResponse = (data: IStoreResponse<R, V>) => {
    this.response = data;
  };

  // 设置扩展数据
  setExtInfo = (key: PropertyPath, value: IAny) => set(this.extInfo, key, value);
  // 获取扩展数据
  getExtInfo = (key: PropertyPath) => get(this.extInfo, key);

  /**
   * 执行 API 请求。
   */
  fetch = async () => {
    this.setLoading(true);
    this.lastFetchID = addWithLimit(this.lastFetchID);
    if (typeof this.api !== 'function') {
      try {
        if (this.apiController) {
          this.apiController.abort();
        }
        this.apiController = new AbortController();
      } catch (error) {
        console.error('AbortController error:', error);
      }
    } else {
      this.apiController = undefined;
    }
    const fetchID = this.lastFetchID;
    const { api } = this;
    const params = (this.options.filterBlankAtRun ? pickBy(this.values, value => (!isBlank(value))) : this.values) as V;
    const response = await runAPI<V, R>(api, this.apiExecutor, params, this.apiController);
    if (response && fetchID === this.lastFetchID) {
      this.setResponse(response);
      this.setLoading(false);
      handleAfterAtFetch(response, this);
      if (isSuccess(response)) {
        this.emitFetchSuccess(response, this);
      } else {
        this.emitFetchError(response, this);
      }
    }
    return response;
  };


  /**
   * 订阅事件。
   * @param event - 事件名称。
   * @param listener - 事件监听器。
   */
  on(event: string, listener: (...args: IAny[]) => void) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(listener);
  }

  /**
   * 取消订阅事件。
   * @param event - 事件名称。
   * @param listener - 事件监听器。
   */
  off(event: string, listener: (...args: IAny[]) => void) {
    if (!this.eventListeners[event]) return;
    this.eventListeners[event] = this.eventListeners[event].filter(l => l !== listener);
  }

  /**
   * 触发事件。
   * @param event - 事件名称。
   * @param args - 传递给事件监听器的参数。
   */
  emit(event: string, ...args: IAny[]) {
    if (!this.eventListeners[event]) return;
    this.eventListeners[event].forEach(listener => listener(...args));
  }

  // 监听请求成功事件
  onFetchSuccess(listener: IFetchListener<V, R>) {
    this.on(EVENT_NAMES.fetchSuccess, listener);
  }
  // 取消监听请求成功事件
  offFetchSuccess(listener: IFetchListener<V, R>) {
    this.off(EVENT_NAMES.fetchSuccess, listener);
  }
  // 触发请求成功事件
  emitFetchSuccess(response: IStoreResponse<R, V>, store: IStore<V, R>) {
    this.emit(EVENT_NAMES.fetchSuccess, response, store);
  }

  // 监听请求失败事件
  onFetchError(listener: IFetchListener<V, R>) {
    this.on(EVENT_NAMES.fetchError, listener);
  }
  // 取消监听请求失败事件
  offFetchError(listener: IFetchListener<V, R>) {
    this.off(EVENT_NAMES.fetchError, listener);
  }
  // 触发请求失败事件
  emitFetchError(response: IStoreResponse<R, V>, store: IStore<V, R>) {
    this.emit(EVENT_NAMES.fetchError, response, store);
  }
}

/**
 * Store 的默认选项。
 *
 * @property {boolean} filterBlankAtRun - 执行 API 时是否过滤参数空值。
 * @property {boolean} bindRoute - 是否绑定路由。
 * @property {'push' | 'replace'} updateRouteType - 更新路由的方法，是 'push' 还是 'replace'。
 * @property {'unequal' | 'any'} routeTrigger - 路由变化的触发条件，是值变化 ('unequal') 还是任意变化 ('any')。
 * @property {boolean} runNow -  立即拉取数据
 * @property {string[]} urlWithDefaultFields - 字值默认值与参数值相同时默认不添加到 URL search 中。如需添加，可以在此配置。默认为空数组。
 * @property {Record<string, string>} keys - 字段键的配置，例如 'page' 和 'pageSize'，用于标准化输入和输出字段。
 */
export type IBaseStoreOptions = {
  filterBlankAtRun: boolean;
  bindRoute: boolean;
  updateRouteType: 'push' | 'replace';
  routeTrigger: 'unequal' | 'any';
  runNow: boolean
  urlWithDefaultFields: string[];
  keys: Record<string, string>;
}

export interface IBaseStoreConfig<V extends object = IAnyObject, R = IAny> {
  defaultValues?: V & IAnyObject;
  fieldsConfig?: IFieldsConfig;
  dictConfig?: IStoreDictConfig<V>;
  apiExecutor?: IStoreHTTPRequest<R, V>;
  api?: IStoreAPI<V, R>;
  options?: Partial<IBaseStoreOptions>;
  extInfo?: IAnyObject;
  // 表单的配置
  formConfig?: Omit<IFormProps, 'initialValues'>;
  defineConfig?: IAnyObject
  notifier?: INotifier;
  afterAtFetch?: IAfterAtFetch
}

export type IFetchListener<V extends object = IAnyObject, R = IAny> = (response: IStoreResponse<R, V>, store: IStore<V, R>) => void
