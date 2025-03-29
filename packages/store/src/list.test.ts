/**
 * @file list.test.ts
 * @description List 模块单元测试
 * @author ickeep <i@ickeep.com>
 * @version 3ab441b
 */

import { IAnyObject } from '@yimoka/shared';
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
        defaultValues: {
          page: 2,
          pageSize: 20,
          sortOrder: ['name', 'desc'],
        },
      });

      expect(customStore.values.page).toBe(2);
      expect(customStore.values.pageSize).toBe(20);
      expect(customStore.values.sortOrder).toEqual(['name', 'desc']);
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

  it('should get list data from response', () => {
    store.setResponse({
      code: 0,
      data: {
        data: [{ id: 1 }, { id: 2 }],
      },
    });
    expect(store.listData).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('should get list data directly if not paginated', () => {
    const store = new ListStore({ isPaginate: false });
    store.setResponse({
      code: 0,
      data: [{ id: 1 }, { id: 2 }],
    });
    expect(store.listData).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('should get pagination info', () => {
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

  it('should check if has next page', () => {
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

  it('should set selected row keys', () => {
    store.setSelectedRowKeys([1, 2, 3]);
    expect(store.selectedRowKeys).toEqual([1, 2, 3]);
  });

  it('should set next loading state', () => {
    store.setNextLoading(true);
    expect(store.nextLoading).toBe(true);
  });

  it('should set next response', () => {
    const response: IStoreResponse = {
      code: 0,
      data: {
        data: [{ id: 3 }, { id: 4 }],
      },
    };
    store.setNextResponse(response);
    expect(store.nextResponse).toEqual(response);
  });

  it('should load next data', () => {
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
  });

  it('should not load next data if data is not array', () => {
    store.setResponse({
      code: 0,
      data: {
        data: [{ id: 1 }, { id: 2 }],
      },
    });
    store.loadNextData([] as Record<string, unknown>[]);
    expect(store.listData).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('should fetch next page', async () => {
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

  it('should not fetch next page if already loading', async () => {
    store.setNextLoading(true);
    const response = await store.fetchNext();
    expect(response).toBeNull();
  });

  it('should not fetch next page if no more data', async () => {
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

  it('should handle fetch next error', async () => {
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

  it('should handle AbortController error', async () => {
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
});
