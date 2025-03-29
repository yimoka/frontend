/**
 * @file list.test.ts
 * @description List 模块单元测试
 * @author ickeep <i@ickeep.com>
 * @version 3ab441b
 */

import { IAnyObject, IHTTPResponse } from '@yimoka/shared';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { IStoreResponse } from './api';
import { ListStore } from './list';

describe('List 模块', () => {
  let store: ListStore<IAnyObject>;

  beforeEach(() => {
    vi.useFakeTimers();
    store = new ListStore({
      fieldsConfig: {
        name: { type: 'string' },
        age: { type: 'number' },
      },
      api: {
        list: {
          url: '/api/users',
          method: 'GET',
        },
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * 测试列表存储初始化
   */
  describe('ListStore 初始化', () => {
    it('应该正确初始化默认值', () => {
      expect(store.isPaginate).toBe(true);
      expect(store.selectedRowKeys).toEqual([]);
      expect(store.nextLoading).toBe(false);
      expect(store.nextResponse).toEqual({});
      expect(store.listData).toEqual([]);
      expect(store.pagination).toBeUndefined();
      expect(store.isHasNext).toBe(false);
    });

    it('应该正确初始化自定义默认值', () => {
      const customStore = new ListStore({
        options: {
          keys: {
            page: 'currentPage',
          },
        },
        defaultValues: {
          page: 2,
          pageSize: 20,
          sortOrder: ['name', 'desc'],
        },
      });


      expect(customStore.values.page).toBe(2);
      expect(customStore.values.pageSize).toBe(20);
      expect(customStore.values.sortOrder).toEqual(['name', 'desc']);

      customStore.setResponse({
        data: {
          data: [],
          currentPage: 2,
          size: 20,
        },
      });

      expect(customStore.pagination).toEqual({
        page: 2,
        pageSize: 20,
        total: 0,
      });
    });

    it('应该正确处理非分页模式', () => {
      const customStore = new ListStore({
        isPaginate: false,
      });

      expect(customStore.isPaginate).toBe(false);
      expect(customStore.values.page).toBeUndefined();
      expect(customStore.values.pageSize).toBeUndefined();
    });
  });

  /**
   * 测试列表数据操作
   */
  describe('ListStore 数据操作', () => {
    it('应该正确处理数组数据', () => {
      const data = [
        { id: 1, name: 'test1' },
        { id: 2, name: 'test2' },
      ];
      store.setResponse({ data });
      expect(store.listData).toEqual(data);
      expect(store.pagination).toEqual({
        page: 1,
        pageSize: 10,
        total: 2,
      });
    });

    it('应该正确处理对象数据', () => {
      const data = {
        data: [
          { id: 1, name: 'test1' },
          { id: 2, name: 'test2' },
        ],
        total: 100,
        page: 2,
        pageSize: 20,
      };
      store.setResponse({ data });
      expect(store.listData).toEqual(data.data);
      expect(store.pagination).toEqual({
        page: 2,
        pageSize: 20,
        total: 100,
      });
    });

    it('应该正确处理空数据', () => {
      store.setResponse({ data: [] });
      expect(store.listData).toEqual([]);
      expect(store.pagination).toEqual({
        page: 1,
        pageSize: 10,
        total: 0,
      });
    });

    it('应该正确处理无效数据', () => {
      store.setResponse({ data: null });
      expect(store.listData).toEqual([]);
      expect(store.pagination).toBeUndefined();
    });
  });

  /**
   * 测试列表加载状态
   */
  describe('ListStore 加载状态', () => {
    it('应该正确处理加载状态', () => {
      store.setLoading(true);
      expect(store.loading).toBe(true);
      store.setLoading(false);
      expect(store.loading).toBe(false);
    });

    it('应该正确处理加载错误', () => {
      const error = new Error('加载失败');
      store.setResponse({ error });
      expect(store.response.error).toBe(error);
      store.setResponse({ error: null });
      expect(store.response.error).toBeNull();
    });

    it('应该正确处理下一页加载状态', () => {
      store.setNextLoading(true);
      expect(store.nextLoading).toBe(true);
      store.setNextLoading(false);
      expect(store.nextLoading).toBe(false);
    });
  });

  /**
   * 测试列表分页计算
   */
  describe('ListStore 分页计算', () => {
    it('应该正确判断是否有下一页', () => {
      store.setResponse({ data: { total: 100, page: 1, pageSize: 10 } });
      expect(store.isHasNext).toBe(true);

      store.setResponse({ data: { total: 10, page: 1, pageSize: 10 } });
      expect(store.isHasNext).toBe(false);

      store.setResponse({ data: { total: 15, page: 1, pageSize: 10 } });
      expect(store.isHasNext).toBe(true);

      store.setResponse({ data: { total: 15, page: 2, pageSize: 10 } });
      expect(store.isHasNext).toBe(false);
    });

    it('应该正确处理数组数据的分页', () => {
      store.setResponse({ data: [{ id: 1 }, { id: 2 }] });
      expect(store.isHasNext).toBe(false);
    });

    it('应该处理无效的分页数据', () => {
      store.setResponse({ data: { total: 0, page: 0, pageSize: 0 } });
      expect(store.isHasNext).toBe(false);
    });
  });

  /**
   * 测试列表选择操作
   */
  describe('ListStore 选择操作', () => {
    it('应该正确设置选中的行键', () => {
      store.setSelectedRowKeys(['1', '2']);
      expect(store.selectedRowKeys).toEqual(['1', '2']);
    });

    it('应该正确处理空选择', () => {
      store.setSelectedRowKeys();
      expect(store.selectedRowKeys).toEqual([]);
    });
  });

  it('应该从响应中获取列表数据', () => {
    store.setResponse({
      code: 0,
      data: {
        data: [{ id: 1 }, { id: 2 }],
      },
    });
    expect(store.listData).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('非分页模式下应该直接获取列表数据', () => {
    const store = new ListStore({ isPaginate: false });
    store.setResponse({
      code: 0,
      data: [{ id: 1 }, { id: 2 }],
    });
    expect(store.listData).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('应该正确获取分页信息', () => {
    store.setResponse({
      success: true,
      data: {
        data: [1, 2, 3],
        total: 100,
        page: 1,
        pageSize: 10,
      },
    });
    expect(store.pagination).toEqual({
      total: 100,
      page: 1,
      pageSize: 10,
    });
  });

  it('应该正确判断是否有下一页', () => {
    store.setResponse({
      code: 0,
      data: {
        total: 100,
        page: 1,
        pageSize: 10,
        data: [],
      },
    });
    expect(store.isHasNext).toBe(true);

    store.setResponse({
      code: 0,
      data: {
        total: 10,
        page: 1,
        pageSize: 10,
        data: [],
      },
    });
    expect(store.isHasNext).toBe(false);
  });

  it('应该正确设置选中的行键', () => {
    store.setSelectedRowKeys([1, 2, 3]);
    expect(store.selectedRowKeys).toEqual([1, 2, 3]);
  });

  it('应该正确设置下一页加载状态', () => {
    store.setNextLoading(true);
    expect(store.nextLoading).toBe(true);
  });

  it('应该正确设置下一页响应数据', () => {
    const response: IStoreResponse = {
      code: 0,
      data: {
        data: [{ id: 3 }, { id: 4 }],
      },
    };
    store.setNextResponse(response);
    expect(store.nextResponse).toEqual(response);
  });

  it('应该正确加载下一页数据', () => {
    store.setResponse({
      code: 0,
      data: {
        data: [{ id: 1 }, { id: 2 }],
      },
    });
    store.loadNextData([{ id: 3 }, { id: 4 }]);
    expect(store.listData).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ]);
    store.setResponse({
      data: [{ id: 1 }, { id: 2 }],
    });
    store.loadNextData([{ id: 7 }, { id: 8 }]);
    expect(store.listData).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 7 },
      { id: 8 },
    ]);
  });

  it('当数据不是数组时不应该加载下一页数据', () => {
    store.setResponse({
      code: 0,
      data: {
        data: [{ id: 1 }, { id: 2 }],
      },
    });
    store.loadNextData([] as Record<string, unknown>[]);
    expect(store.listData).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('应该正确获取下一页数据', async () => {
    const mockApiResponse: IStoreResponse = {
      code: 0,
      data: {
        data: [{ id: 3 }, { id: 4 }],
        total: 100,
        page: 2,
        pageSize: 10,
      },
    };
    store.setResponse({
      code: 0,
      data: {
        data: [{ id: 1 }, { id: 2 }],
        total: 100,
        page: 1,
        pageSize: 10,
      },
    });
    store.api = vi.fn().mockResolvedValue(mockApiResponse);
    store.setValues({ page: 1 });

    const response = await store.fetchNext();
    expect(response).toEqual(mockApiResponse);
    expect(store.listData).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ]);
    expect(store.values.page).toBe(2);
  });

  // 不过滤空间 加载下一页
  it('不过滤空间 加载下一页', async () => {
    store.setValues({ page: 1, name: '' });
    store.setResponse({
      code: 0,
      data: {
        data: [{ id: 1 }, { id: 2 }],
        total: 100,
        page: 1,
        pageSize: 10,
      },
    });
    store.api = vi.fn();
    store.options.filterBlankAtRun = false;
    store.fetchNext();
    expect(store.api).toHaveBeenCalledWith({
      page: 2,
      pageSize: 10,
      name: '',
      sortOrder: [],
    });
  });

  it('没有更多数据时不应该获取下一页数据', async () => {
    store.setResponse({
      code: 0,
      data: {
        data: [{ id: 1 }, { id: 2 }],
        total: 2,
        page: 1,
        pageSize: 10,
      },
    });
    const response = await store.fetchNext();
    expect(response).toBeNull();
  });

  it('应该正确处理获取下一页数据时的错误', async () => {
    store.setResponse({
      success: true,
      data: {
        data: [1, 2, 3],
        pagination: {
          total: 100,
          page: 1,
          pageSize: 10,
        },
      },
    });
    store.api = vi.fn().mockRejectedValue(new Error('API Error'));
    store.setValues({ page: 1 });
    try {
      await store.fetchNext();
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe('API Error');
      }
    }
  });

  it('应该正确处理 AbortController 错误', async () => {
    vi.spyOn(globalThis, 'AbortController').mockImplementation(() => {
      throw new Error('AbortController error');
    });

    const store = new ListStore({
      api: {
        url: '/api/list',
      },
    });

    try {
      await store.fetch();
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe('AbortController error');
      }
    }
  });

  it('应该正确处理22 next AbortController ', async () => {
    const abortController = vi.spyOn(globalThis, 'AbortController').mockImplementation(() => ({ abort: vi.fn(), signal: vi.fn() } as unknown as AbortController));
    const store = new ListStore({
      api: {
        url: '/api/list',
      },
      apiExecutor: () => new Promise<IHTTPResponse<IAnyObject, IAnyObject>>(resolve => setTimeout(() => resolve({ code: 0, data: {}, msg: '' }), 100)),
    });
    store.setResponse({
      code: 0,
      data: {
        data: [{ id: 1 }, { id: 2 }],
        total: 100,
        page: 1,
        pageSize: 2,
      },
    });

    try {
      store.fetchNext();
      // 等待 20 ms
      vi.advanceTimersByTime(20);
      store.fetchNext();
      await vi.runAllTimersAsync();
      expect(abortController.mock.calls.length).toBe(2);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe('AbortController error');
      }
    }
  });

  it('应该正确处理 next AbortController 错误', async () => {
    vi.spyOn(globalThis, 'AbortController').mockImplementation(() => {
      throw new Error('AbortController error');
    });

    const store = new ListStore({
      api: {
        url: '/api/list',
      },
    });
    store.setResponse({
      success: true,
      data: {
        data: [{ id: 1 }, { id: 2 }],
        total: 100,
        page: 1,
        pageSize: 2,
      },
    });

    try {
      store.fetchNext();
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe('AbortController error');
      }
    }
  });

  /**
   * 测试自定义分页键名
   */
  describe('ListStore 自定义分页键名', () => {
    it('应该支持自定义分页键名', () => {
      const customStore = new ListStore({
        options: {
          keys: {
            page: 'currentPage',
            pageSize: 'size',
            total: 'totalCount',
          },
        },
      });

      customStore.setResponse({
        data: {
          data: [1, 2, 3],
          currentPage: 2,
          size: 5,
          totalCount: 15,
        },
      });

      expect(customStore.pagination).toEqual({
        page: 2,
        pageSize: 5,
        total: 15,
      });
    });

    it('当自定义键名数据缺失时应使用默认值', () => {
      const customStore = new ListStore({
        options: {
          keys: {
            page: 'currentPage',
            pageSize: 'size',
            total: 'totalCount',
          },
        },
      });

      customStore.setResponse({
        data: {
          data: [1, 2, 3],
        },
      });

      expect(customStore.pagination).toEqual({
        page: 1,
        pageSize: 10,
        total: 3,
      });
    });
  });

  /**
   * 测试异常数据格式
   */
  describe('ListStore 异常数据格式', () => {
    it('当 data 不是数组时应返回 undefined', () => {
      store.setResponse({
        data: {
          data: 'not an array',
        },
      });
      expect(store.pagination).toBeUndefined();
    });

    it('当 data 是对象但缺少 data 字段时应返回 undefined', () => {
      store.setResponse({
        data: {
          page: 1,
          pageSize: 10,
          total: 100,
        },
      });
      expect(store.pagination).toBeUndefined();
    });

    it('当 data 是对象但 data 字段不是数组时应返回 undefined', () => {
      store.setResponse({
        data: {
          data: 'not an array',
          page: 1,
          pageSize: 10,
          total: 100,
        },
      });
      expect(store.pagination).toBeUndefined();
    });
  });

  /**
   * 测试边界情况
   */
  describe('ListStore 边界情况', () => {
    it('当数据为空数组时应返回正确的分页信息', () => {
      store.setResponse({
        data: {
          data: [],
          page: 1,
          pageSize: 10,
          total: 0,
        },
      });
      expect(store.pagination).toEqual({
        page: 1,
        pageSize: 10,
        total: 0,
      });
    });

    it('当分页数据为 0 时应正确处理', () => {
      store.setResponse({
        data: {
          data: [],
          page: 0,
          pageSize: 0,
          total: 0,
        },
      });
      expect(store.pagination).toEqual({
        page: 0,
        pageSize: 0,
        total: 0,
      });
    });

    it('当 options.keys 为空时应使用默认键名', () => {
      const customStore = new ListStore({
        options: {
          keys: undefined,
        },
      });

      customStore.setResponse({
        data: {
          data: [1, 2, 3],
          page: 2,
          pageSize: 5,
          total: 15,
        },
      });

      expect(customStore.pagination).toEqual({
        page: 2,
        pageSize: 5,
        total: 15,
      });
    });

    it('当 data.data 为 undefined 时应返回 undefined', () => {
      store.setResponse({
        data: {
          data: undefined,
          page: 1,
          pageSize: 10,
          total: 100,
        },
      });
      expect(store.pagination).toBeUndefined();
    });

    it('当 total 字段缺失时应使用 data.data.length', () => {
      store.setResponse({
        data: {
          data: [1, 2, 3],
          page: 1,
          pageSize: 10,
        },
      });
      expect(store.pagination).toEqual({
        page: 1,
        pageSize: 10,
        total: 3,
      });
    });

    it('当 filterBlankAtRun 为 true 时应过滤空值', async () => {
      const api = vi.fn();
      const customStore = new ListStore({
        options: {
          filterBlankAtRun: true,
        },
        api,
      });

      customStore.setValues({
        page: 1,
        pageSize: 10,
        name: '',
        age: null,
        status: undefined,
      });

      await customStore.fetch();
      expect(api).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
      });
    });
  });
});
