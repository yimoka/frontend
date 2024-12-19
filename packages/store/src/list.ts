import { action, observable } from '@formily/reactive';
import { IAnyObject, IAny, IObjKey, mergeWithArrayOverride, isBlank, addWithLimit, isSuccess } from '@yimoka/shared';

import { cloneDeep, get, pickBy, set } from 'lodash-es';

import { IStoreResponse, runStoreAPI } from './api';
import { BaseStore, IBaseStoreConfig, IBaseStoreOptions } from './base';

export const listKeysDefault: Record<string, string> = {
  sortOrder: 'sortOrder',
  page: 'page',
  pageSize: 'pageSize',
  total: 'count',
};

export const listOptionsDefault: Partial<IBaseStoreOptions> = {
  bindRoute: true,
  filterBlankAtRun: true,
  entryRunMode: 'required',
  keys: { ...listKeysDefault },
};

// 列表数据 基于 BaseStore 进行扩展，提供了列表数据的管理能力。
export class ListStore<V extends object = IAnyObject, R = IAny> extends BaseStore<V, R> {
  // 列表选择的行
  selectedRowKeys: IObjKey[] = [];

  // 当前暂时只支持 page + 1 的流式加载，游标等方式暂不支持
  // 流式页面下一页加载状态
  nextLoading = false;
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
      defineConfig: {
        ...defineConfig,
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
      },
    });
  }

  get listData() {
    const data = this.response.data as Array<IAny> | { data?: Array<IAny> };
    if (Array.isArray(data)) {
      return data;
    }
    return Array.isArray(data?.data) ? data.data : [];
  }

  get pagination() {
    const data = this.response.data as Array<IAny> | { data?: Array<IAny> };
    const { page, pageSize, total } = this.options.keys ?? listKeysDefault;
    if (Array.isArray(data)) {
      return { current: this.values[page], pageSize: this.values[pageSize], total: data.length };
    }
    if (Array.isArray(data?.data)) {
      return {
        current: get(data, total, this.values[total]),
        pageSize: get(data, pageSize, this.values[pageSize]),
        total: get(data, total, data?.data?.length ?? 0),
      };
    }
    return undefined;
  }

  // 是否还有下一页
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

  setSelectedRowKeys = (keys: IObjKey[] = []) => {
    this.selectedRowKeys = keys;
  };

  setNextLoading = (loading: boolean) => {
    this.nextLoading = loading;
  };

  setNextResponse = (response: IStoreResponse<R, V>) => {
    this.nextResponse = response;
  };

  // 加载下一页数据
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

  // 运行下一页
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
        this.loadNextData(nextResponse?.data.data);
        this.setFieldValue(page, get(nextResponse.data, page, nextPage));
      }
    }
    return nextResponse;
  };
}
