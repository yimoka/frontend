import { createForm, Form, IFormMergeStrategy, IFormProps } from '@formily/core';
import { action, define, observable } from '@formily/reactive';
import { addWithLimit, IAny, IAnyObject, isBlank } from '@yimoka/shared';
import { cloneDeep, get, pick, pickBy, set } from 'lodash-es';

import { IStoreAPI, IStoreHTTPRequest, IStoreResponse, runStoreAPI } from './api';
import { IStoreDict, IStoreDictConfig, IStoreDictLoading } from './dict';
import { getSearchParamByValue, getValueBySearchParam, IField, IFieldsConfig } from './field';

/**
 * 应用配置的默认选项。
 *
 * @property {boolean} filterBlankAtRun - 指示在运行时是否过滤空值。
 * @property {boolean} bindRoute - 指定是否绑定路由。
 * @property {'push' | 'replace'} updateRouteType - 确定更新路由的方法，是 'push' 还是 'replace'。
 * @property {'unequal' | 'any'} routeTrigger - 指定路由变化的触发条件，是值变化 ('unequal') 还是任意变化 ('any')。
 * @property {'run' | 'required' | 'no'} entryRunMode - 定义进入时的执行模式：'run' 表示立即执行，'required' 表示满足必填项时执行，'no' 表示不执行。
 * @property {string[]} urlWithDefaultFields - 生成 URL 时要包含的默认字段列表。默认为空数组。
 * @property {Record<string, string>} fieldKeys - 字段键的配置，例如 'page' 和 'pageSize'，用于标准化输入和输出字段。
 */
const DF_OPTIONS = {
  filterBlankAtRun: false,
  bindRoute: false,
  updateRouteType: 'push' as 'push' | 'replace',
  routeTrigger: 'unequal' as 'unequal' | 'any',
  entryRunMode: 'no' as 'run' | 'required' | 'no',
  urlWithDefaultFields: [] as string[],
  fieldKeys: {} as Record<string, string>,
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
 *  age: 18,
 * }
 * });
 * ```
 */
export class BaseStore<V extends object = IAnyObject, R = IAny> {
  /**
   * 深拷贝 `DF_OPTIONS` 并将其赋值给 `options`。
   *
   * `cloneDeep` 函数用于创建一个对象的深拷贝，确保 `options` 与 `DF_OPTIONS` 之间没有引用关系。
   *
   * @see https://lodash.com/docs/4.17.15#cloneDeep
   */
  options = cloneDeep(DF_OPTIONS);

  /**
   * @type {IFieldsConfig<V>}
   * @default {}
   * @description fieldsConfig 是一个 IFieldsConfig 类型的对象，用于配置字段。默认值是一个空对象。
   */
  fieldsConfig: IFieldsConfig<V> = Object({});

  /**
   * 默认值对象，包含类型 V 和 IAnyObject 的属性。
   *
   * @type {V & IAnyObject}
   */
  defaultValues: V & IAnyObject;

  /**
   * 表单对象，包含表单的所有字段和方法。来源于 `@formily/core` 的 createForm 方法。
   *
   * @type {Form<V & IAnyObject>}
   */
  form: Form<V & IAnyObject>;

  dictConfig: IStoreDictConfig<V> = [];
  dictLoading: IStoreDictLoading<V> = {};
  dict: IStoreDict<V> = {};

  // 请求执行器
  apiExecutor?: IStoreHTTPRequest<R, V>;
  api?: IStoreAPI<V, R>;
  loading = false;
  response: IStoreResponse<R, V> = {};
  moreLoading = false;
  moreResponse: IStoreResponse<R, V> = {};

  private lastFetchID = 0;
  private apiController: AbortController | undefined;

  // 选中的行的 keys 用于表格批量操作
  selectedRowKeys: Array<string | number> = [];

  // 扩展数据
  extInfo: IAnyObject = {};

  constructor(config: IBaseStoreConfig<V, R> = {}) {
    const { defaultValues = {}, dictConfig, apiExecutor, api, options, extInfo, formConfig, defineConfig } = config;
    this.defaultValues = defaultValues as V & IAnyObject;
    this.dictConfig = dictConfig || [];
    this.apiExecutor = apiExecutor;
    this.api = api;
    this.extInfo = extInfo || {};
    this.options = { ...this.options, ...options };
    this.form = createForm({ ...formConfig, initialValues: defaultValues });

    define(this, {
      dict: observable,
      dictConfig: observable, // 以支持设置和重置时及时更新
      dictLoading: observable,
      response: observable.shallow,
      loading: observable,
      extInfo: observable,

      selectedRowKeys: observable,
      moreLoading: observable,
      moreResponse: observable.shallow,

      setDict: action,
      setDictLoading: action,
      setDictByField: action,
      resetDictConfig: action,
      resetDictConfigByField: action,

      setLoading: action,
      setResponse: action,

      setExtInfo: action,

      runAPI: action,
      runAPIByField: action,
      runAPIByValues: action,
      runAPIDataBySearch: action,

      ...defineConfig,
    });
  }

  get values() {
    return this.form.values;
  }

  /**
   * 获取默认值的深拷贝。
   *
   * @returns 返回一个包含默认值的深拷贝对象。
   */
  getDefaultValues = () => cloneDeep(this.defaultValues);

  setValues = (values: Partial<V>, strategy?: IFormMergeStrategy) => {
    this.form.setValues(values, strategy);
  };

  resetValues = () => {
    this.form.setValues(this.getDefaultValues(), 'overwrite');
  };

  resetValuesByFields = (fields: Array<IField<V>> | IField<V>) => {
    this.setValues(pick(this.getDefaultValues(), fields));
  };

  setValuesByField = (field: IField<V>, value: IAny) => {
    this.form.setValuesIn(field as IAny, value);
  };

  setValuesByRouter = (search: string | IAnyObject, params?: IAnyObject, type: 'all' | 'part' = 'all') => {
    let newValues: IAnyObject = {};
    const keys = Object.keys(this.values);
    if (typeof search === 'string') {
      try {
        // 小程序会报错
        const searchParams = new URLSearchParams(search);
        keys.forEach((key) => {
          const strValue = searchParams.get(key);
          if (strValue !== null) {
            newValues[key] = getValueBySearchParam(strValue, this.fieldsConfig[key], this.defaultValues[key]);
          }
        });
      } catch (error) {
        console.error('setValuesByRouter error:', error);
      }
    }
    if (typeof search === 'object') {
      Object.entries(pick(search, keys)).forEach(([key, value]) => newValues[key] = getValueBySearchParam(value, this.fieldsConfig[key], this.defaultValues[key]));
    }
    if (typeof params === 'object') {
      Object.entries(pick(params, keys)).forEach(([key, value]) => newValues[key] = getValueBySearchParam(value, this.fieldsConfig[key], this.defaultValues[key]));
    }
    if (type === 'all') {
      newValues = { ...this.getDefaultValues(), ...newValues };
    };
    this.setValues(newValues);
  };

  getURLSearch = () => {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(this.values).forEach(([key, value]) => {
        const defaultValue = this.defaultValues[key];
        if ((value !== defaultValue || this.options.urlWithDefaultFields?.includes(key)) && (!isBlank(value) || !isBlank(defaultValue))) {
          const str = getSearchParamByValue(value);
          searchParams.append(key, str);
        }
      });
      return searchParams.toString();
    } catch (error) {
      console.error('getURLSearch error:', error);
      return '';
    }
  };

  setDict = (dict: IStoreDict<V>) => this.dict = dict;

  setDictByField = (field: IField<V>, value: IAny) => this.dict[field] = value;

  setDictLoading = (field: IField<V>, value: boolean) => this.dictLoading[field] = value;

  resetDictConfig = () => {
    this.dictConfig = [...this.dictConfig];
  };

  resetDictConfigByField = (field: IField<V>) => {
    this.dictConfig = this.dictConfig.map(item => (item.field === field ? { ...item } : item));
  };

  setLoading = (loading: boolean) => this.loading = loading;

  setResponse = (data: IStoreResponse<R, V>) => {
    this.response = data;
  };

  // 设置扩展数据
  setExtInfo = (key: string, value: IAny) => set(this.extInfo, key, value);
  // 获取扩展数据
  getExtInfo = (key: string) => get(this.extInfo, key);

  runAPI = async () => {
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
    const response = await runStoreAPI<V, R>(api, this.apiExecutor, params, this.apiController);

    if (response && fetchID === this.lastFetchID) {
      this.setResponse(response);
      this.setLoading(false);
    }
    return response;
  };

  runAPIByField = (field: IField<V>, value: IAny) => {
    this.setValuesByField(field, value);
    return this.runAPI();
  };

  runAPIByValues = (values: Partial<V>, strategy?: IFormMergeStrategy) => {
    this.setValues(values, strategy);
    return this.runAPI();
  };

  runAPIDataBySearch = async (search: string | IAnyObject, params?: IAnyObject, type: 'all' | 'part' = 'all') => {
    this.setValuesByRouter(search, params, type);
    return this.runAPI();
  };
}

export interface IBaseStoreConfig<V extends object = IAnyObject, R = IAny> {
  defaultValues?: V & IAnyObject;
  dictConfig?: IStoreDictConfig<V>;
  apiExecutor?: IStoreHTTPRequest<R, V>;
  api?: IStoreAPI<V, R>;
  options?: Partial<typeof DF_OPTIONS>;
  extInfo?: IAnyObject;
  // 表单的配置
  formConfig?: Omit<IFormProps, 'initialValues'>;
  defineConfig?: IAnyObject
}
