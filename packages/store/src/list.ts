import { action, define, observable } from '@formily/reactive';
import { IAnyObject, IAny, IObjKey, mergeWithArrayOverride, isBlank, addWithLimit, isSuccess } from '@yimoka/shared';

import { cloneDeep, get, pickBy, set } from 'lodash-es';

import { IStoreResponse, runStoreAPI } from './api';
import { BaseStore, IBaseStoreConfig, IBaseStoreOptions } from './base';

export const listKeysDefault: Record<string, string> = {
  sortOrder: 'sortOrder',
  page: 'page',
  pageSize: 'pageSize',
  total: 'total',
};

export const listOptionsDefault: Partial<IBaseStoreOptions> = {
  bindRoute: true,
  filterBlankAtRun: true,
  entryRunMode: 'required',
  keys: { ...listKeysDefault },
};

/**
 * ListStore 基于 BaseStore 进行扩展 提供列表数据的管理能力。
 *
 * @template V 列表参数的类型，默认为 `IAnyObject`
 * @template R 响应数据的类型，默认为 `IAny`
 *
 * @example
 * ```ts
 * // 创建一个 ListStore 实例
 * const listStore = new ListStore();
 *
 * // 设置选中的行键
 * listStore.setSelectedRowKeys(['row1', 'row2']);
 * console.log(listStore.selectedRowKeys); // 输出: ['row1', 'row2']
 *
 * // 设置下一页加载状态
 * listStore.setNextLoading(true);
 * console.log(listStore.nextLoading); // 输出: true
 *
 * // 设置下一页响应数据
 * listStore.setNextResponse({ data: [{ id: 1 }, { id: 2 }] });
 * console.log(listStore.nextResponse); // 输出: { data: [{ id: 1 }, { id: 2 }] }
 *
 * // 获取列表数据
 * console.log(listStore.listData); // 输出: [{ id: 1 }, { id: 2 }]
 *
 * // 获取分页信息
 * console.log(listStore.pagination); // 输出: { page: 1, pageSize: 10, total: 2 }
 *
 * // 判断是否有下一页
 * console.log(listStore.isHasNext); // 输出: false
 *
 * // 加载下一页数据
 * listStore.loadNextData([{ id: 3 }]);
 * console.log(listStore.listData); // 输出: [{ id: 1 }, { id: 2 }, { id: 3 }]
 *
 * // 拉取下一页数据
 * listStore.fetchNext().then(response => {
 *   console.log(response);
 *   console.log(listStore.listData);
 * });
 *
 * ```
 * @param {IBaseStoreConfig<V, R>} config 配置对象
 */
export class ListStore<V extends object = IAnyObject, R = IAny> extends BaseStore<V, R> {
  /**
   * 选中的行键数组。
   *
   * @type {IObjKey[]}
   */
  selectedRowKeys: IObjKey[] = [];

  /**
   * 表示是否正在加载下一页数据的标志。
   * 当前暂时只支持 page + 1 的流式加载，游标等方式暂不支持
   *
   * @type {boolean}
   */
  nextLoading = false;

  /**
   * 表示下一页数据响应的对象。
   *
   * @type {IStoreResponse<R, V>}
   */
  nextResponse: IStoreResponse<R, V> = {};

  private nextLastFetchID = 0;
  private nextAPIController: AbortController | undefined;

  constructor(config: IBaseStoreConfig<V, R> = {}) {
    const { options, defineConfig, defaultValues, ...args } = config;
    const curOptions = mergeWithArrayOverride<IBaseStoreOptions>(cloneDeep(listOptionsDefault), options);
    const { page, pageSize, sortOrder } = curOptions.keys ?? listKeysDefault;
    const curDefaultValues = { [sortOrder]: [], [page]: 1, [pageSize]: 10, ...defaultValues } as V & IAnyObject;
    super({
      ...args,
      options: curOptions,
      defaultValues: curDefaultValues,
    });

    define(this, {
      selectedRowKeys: observable,
      nextLoading: observable,
      nextResponse: observable.shallow,
      listData: observable.computed,
      pagination: observable.computed,
      isHasNext: observable.computed,

      setSelectedRowKeys: action,
      setNextLoading: action,
      setNextResponse: action,
      loadNextData: action,
      fetchNext: action,
    });
  }

  /**
   * 获取列表数据。
   *
   * @remarks
   * 该方法会根据 `response.data` 的类型返回不同的结果：
   * - 如果 `response.data` 是一个数组，则直接返回该数组。
   * - 如果 `response.data` 是一个对象且包含 `data` 属性，并且 `data` 属性是一个数组，则返回 `data` 属性。
   * - 否则，返回一个空数组。
   *
   * @returns 返回一个包含列表数据的数组。
   */
  get listData() {
    const data = this.response.data as Array<IAny> | { data?: Array<IAny> };
    if (Array.isArray(data)) {
      return data;
    }
    return Array.isArray(data?.data) ? data.data : [];
  }

  /**
   * 获取分页信息。
   *
   * @returns 如果 `response.data` 是一个数组，则返回包含当前页码、每页大小和总数的对象。
   *          如果 `response.data` 是一个包含 `data` 数组的对象，则返回包含当前页码、每页大小和总数的对象。
   *          否则返回 `undefined`。
   *
   * @remarks
   * - `this.response.data` 可以是一个数组或一个包含 `data` 数组的对象。
   * - `this.options.keys` 包含分页相关的键，默认为 `listKeysDefault`。
   * - `this.values` 包含当前页码、每页大小和总数的值。
   * - 使用 `get` 函数从 `data` 对象中获取分页相关的值。
   */
  get pagination() {
    const data = this.response.data as Array<IAny> | { data?: Array<IAny> };
    const { page, pageSize, total } = this.options.keys ?? listKeysDefault;
    if (Array.isArray(data)) {
      return { page: this.values[page], pageSize: this.values[pageSize], total: data.length };
    }
    if (Array.isArray(data?.data)) {
      return {
        page: get(data, page, this.values[page]),
        pageSize: get(data, pageSize, this.values[pageSize]),
        total: get(data, total, data?.data?.length ?? 0),
      };
    }
    return undefined;
  }

  /**
   * 判断是否有下一页数据。
   *
   * @returns {boolean} 如果有下一页数据则返回 true，否则返回 false。
   *
   * 该方法通过检查 `nextResponse` 或 `response` 中的数据来确定是否有下一页数据。
   * 如果数据是数组，则认为接口返回了全部数据，不进行分页。
   * 如果数据不是数组，则根据 `total`、`page` 和 `pageSize` 的值计算是否有下一页数据。
   *
   * @remarks
   * - `listData`：当前列表数据。
   * - `response`：当前请求的响应数据。
   * - `nextResponse`：下一页请求的响应数据。
   * - `options`：分页选项，包含 `page`、`pageSize` 和 `total` 的键名。
   * - `listKeysDefault`：默认的分页键名。
   * - `this.values`：当前分页的页码和每页大小。
   */
  get isHasNext() {
    const { listData, response, nextResponse, options } = this;
    const { page, pageSize, total } = options.keys ?? listKeysDefault;
    const data = nextResponse.data ?? response.data;
    if (!data) {
      return false;
    }

    // 如果是数组，则认为接口返回了全部数据 不分页
    if (Array.isArray(data)) {
      return false;
    }
    const totalNum = get(data, total, listData.length) as number;
    const pageNum = get(data, page, this.values[page]) as number;
    const pageSizeNum = get(data, pageSize, this.values[pageSize]) as number;
    if (!totalNum || !pageNum || !pageSizeNum) {
      return false;
    }
    return totalNum > pageNum * pageSizeNum;
  }

  /**
   * 设置选中的行键。
   *
   * @param {IObjKey[]} [keys=[]] - 要设置的行键数组，默认为空数组。
   */
  setSelectedRowKeys = (keys: IObjKey[] = []) => {
    this.selectedRowKeys = keys;
  };

  /**
   * 设置下一页加载状态。
   *
   * @param loading - 表示是否正在加载下一页的布尔值。
   */
  setNextLoading = (loading: boolean) => {
    this.nextLoading = loading;
  };

  /**
   * 设置下一个数据的响应对象。
   *
   * @param response - 要设置的响应对象，类型为 `IStoreResponse<R, V>`。
   */
  setNextResponse = (response: IStoreResponse<R, V>) => {
    this.nextResponse = response;
  };

  /**
   * 加载下一页数据。
   *
   * @param data - 要加载的数据数组。
   */
  loadNextData = (data: IAny[]) => {
    if (!isBlank(data) && Array.isArray(data)) {
      const newResponse = { ...this.response } as IAny;
      if (Array.isArray(newResponse.data)) {
        newResponse.data = [...newResponse.data, ...data];
      } else if (Array.isArray(newResponse.data?.data)) {
        newResponse.data.data = [...newResponse.data.data, ...data];
      }
      this.setResponse(newResponse);
    }
  };

  /**
   * 摘取下一页数据的
   *
   * @returns {Promise<R | null>} 返回一个 Promise，解析为下一页的响应数据或 null。
   *
   * @remarks
   * - 如果当前正在加载下一页数据或没有更多数据，则直接返回 null。
   * - 根据配置选项，过滤空值或直接使用当前的参数值。
   * - 增加页码并设置加载状态。
   * - 如果 API 不是函数，则处理 AbortController 以取消先前的请求。
   * - 调用 `runStoreAPI` 方法执行 API 请求，并在请求成功时加载下一页数据。
   *
   * @throws {Error} 如果 AbortController 初始化失败。
   */
  // eslint-disable-next-line complexity
  fetchNext = async () => {
    if (this.nextLoading || !this.isHasNext) {
      return null;
    }
    const { page } = this.options.keys ?? listKeysDefault;
    const params = (this.options.filterBlankAtRun ? pickBy(this.values, value => (!isBlank(value))) : { ...this.values }) as V;
    const nextPage = this.values[page] + 1;
    set(params, page, nextPage);
    this.setNextLoading(true);
    this.nextLastFetchID = addWithLimit(this.nextLastFetchID);
    if (typeof this.api !== 'function') {
      try {
        if (this.nextAPIController) {
          this.nextAPIController.abort();
        }
        this.nextAPIController = new AbortController();
      } catch (error) {
        console.error('AbortController error:', error);
      }
    } else {
      this.nextAPIController = undefined;
    }
    const fetchID = this.nextLastFetchID;
    const { api } = this;
    const nextResponse = await runStoreAPI<V, R>(api, this.apiExecutor, params, this.nextAPIController);
    if (nextResponse && fetchID === this.nextLastFetchID) {
      this.setNextResponse(nextResponse);
      this.setNextLoading(false);
      if (isSuccess(nextResponse)) {
        // 加载下一页数据 这里要求 data 为 object 包含 data 字段及其他分页信息
        this.loadNextData((nextResponse?.data as IAny)?.data ?? []);
        this.setFieldValue(page, get(nextResponse.data, page, nextPage));
      }
    }
    return nextResponse;
  };
}
