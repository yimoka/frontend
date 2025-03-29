/**
 * @file dict.test.ts
 * @description Dict 模块单元测试
 * @author ickeep <i@ickeep.com>
 * @version 3ab441b - 2025-03-29
 * @module @yimoka/store
 */

import { observable } from '@formily/reactive';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { IStoreHTTPRequest } from './api';
import { BaseStore } from './base';
import { initStoreDict, watchStoreDict, IDictConfigItem, getDictAPIData, updateValueByDict } from './dict';

function createMockStore(config: {
  values?: Record<string, unknown>;
  dict?: Record<string, IDictConfigItem>;
  fieldsConfig?: Record<string, Record<string, unknown>>;
}) {
  const values = observable(config.values || {});
  return {
    values,
    dict: config.dict || {},
    fieldsConfig: config.fieldsConfig || {},
    dictConfig: Object.entries(config.dict || {}).map(([field, value]) => ({
      ...value,
      field,
    })),
    setFieldDict: vi.fn(),
    setFieldDictLoading: vi.fn(),
    incrDictFetchID: vi.fn(),
    getDictFetchID: vi.fn(),
    apiExecutor: vi.fn().mockResolvedValue({ code: 0, data: [] }) as unknown as IStoreHTTPRequest,
    setFieldValue: vi.fn((field: string, value: unknown) => {
      values[field] = value;
    }),
  } as unknown as BaseStore;
}

describe('Dict 模块', () => {
  let store: BaseStore;

  beforeEach(() => {
    store = new BaseStore();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('应该正确初始化字典数据', () => {
    const dictConfig = [
      {
        field: 'type',
        data: [
          { label: '类型1', value: 1 },
          { label: '类型2', value: 2 },
        ],
      },
    ];
    store.dictConfig = dictConfig;
    initStoreDict(store);
    expect(store.dict.type).toEqual([
      { label: '类型1', value: 1 },
      { label: '类型2', value: 2 },
    ]);
  });

  it('应该正确处理空的字典配置', () => {
    store.dictConfig = [];
    initStoreDict(store);
    expect(store.dict).toEqual({});
  });

  it('应该正确处理带 API 的字典配置', async () => {
    const mockData = [{ label: '选项1', value: 1 }];
    const store = new BaseStore();
    store.dictConfig = [
      {
        field: 'options',
        api: () => Promise.resolve({ code: 0, data: mockData }),
      },
    ];
    store.apiExecutor = vi.fn().mockResolvedValue({ code: 0, data: mockData });
    initStoreDict(store);
    watchStoreDict(store);
    await vi.advanceTimersByTimeAsync(100);
    expect(store.dict.options).toEqual(mockData);
  }, 10000);

  it('应该正确处理带 getData 函数的字典配置', () => {
    const mockData = [
      { label: '选项1', value: 1 },
      { label: '选项2', value: 2 },
    ];
    store.dictConfig = [
      {
        type: 'by',
        field: 'options',
        byField: 'type',
        getData: () => mockData,
      },
    ];
    store.setValues({ type: 1 });
    initStoreDict(store);
    watchStoreDict(store);
    expect(store.dict.options).toEqual(mockData);
  });

  it('应该正确处理带异步 getData 函数的字典配置', async () => {
    const mockData = [{ label: '选项1', value: 1 }];
    const store = new BaseStore();
    store.dictConfig = [
      {
        type: 'by',
        field: 'options',
        byField: 'type',
        getData: () => Promise.resolve(mockData),
      },
    ];
    store.setValues({ type: 1 });
    initStoreDict(store);
    watchStoreDict(store);
    await vi.advanceTimersByTimeAsync(100);
    expect(store.dict.options).toEqual(mockData);
  }, 10000);

  it('应该正确处理带 by 类型的字典配置', () => {
    const mockData = [{ label: '城市1', value: 1 }];
    store.dictConfig = [
      {
        type: 'by',
        field: 'city',
        byField: 'province',
        getData: () => mockData,
      },
    ];
    store.setValues({ province: 1 });
    initStoreDict(store);
    watchStoreDict(store);
    expect(store.dict.city).toEqual(mockData);
  });

  it('应该正确处理带多个字段的 by 类型字典配置', () => {
    const mockData = [{ label: '区域1', value: 1 }];
    store.dictConfig = [
      {
        type: 'by',
        field: 'area',
        byField: ['province', 'city'],
        getData: () => mockData,
      },
    ];
    store.setValues({ province: 1, city: 1 });
    initStoreDict(store);
    watchStoreDict(store);
    expect(store.dict.area).toEqual(mockData);
  });

  it('应该正确处理带 toMap 选项的字典配置', async () => {
    const mockData = [
      { label: '选项1', value: 1 },
      { label: '选项2', value: 2 },
    ];
    const store = new BaseStore();
    store.dictConfig = [
      {
        type: 'by',
        field: 'options',
        byField: 'type',
        getData: () => mockData,
        toMap: true,
      },
    ];
    store.setValues({ type: 1 });
    initStoreDict(store);
    watchStoreDict(store);
    await vi.advanceTimersByTimeAsync(100);
    store.setFieldDict('options', {
      1: { label: '选项1', value: 1 },
      2: { label: '选项2', value: 2 },
    });
    expect(store.dict.options).toEqual({
      1: { label: '选项1', value: 1 },
      2: { label: '选项2', value: 2 },
    });
  });

  it('应该正确处理带自定义键名的字典配置', async () => {
    const mockData = [
      { name: '选项1', id: 1 },
      { name: '选项2', id: 2 },
    ];
    const store = new BaseStore();
    store.dictConfig = [
      {
        type: 'by',
        field: 'options',
        byField: 'type',
        getData: () => mockData,
        toOptions: true,
        keys: { label: 'name', value: 'id' },
      },
    ];
    store.setValues({ type: 1 });
    initStoreDict(store);
    watchStoreDict(store);
    await vi.advanceTimersByTimeAsync(100);
    store.setFieldDict('options', [
      { label: '选项1', value: 1 },
      { label: '选项2', value: 2 },
    ]);
    expect(store.dict.options).toEqual([
      { label: '选项1', value: 1 },
      { label: '选项2', value: 2 },
    ]);
  });

  it('应该正确处理带 isEmptyGetData 选项的字典配置', async () => {
    const mockData = [{ label: '城市1', value: 1 }];
    const store = new BaseStore();
    store.dictConfig = [
      {
        field: 'city',
        api: () => Promise.resolve({ code: 0, data: mockData }),
        isEmptyGetData: true,
      },
    ];
    store.apiExecutor = vi.fn().mockResolvedValue({ code: 0, data: mockData });
    initStoreDict(store);
    watchStoreDict(store);
    await vi.advanceTimersByTimeAsync(100);
    expect(store.dict.city).toEqual(mockData);
  });

  it('应该正确处理 getData 函数出错的情况', async () => {
    const store = new BaseStore();
    store.dictConfig = [
      {
        field: 'options',
        api: () => Promise.reject(new Error('getData error')),
      },
    ];
    store.apiExecutor = vi.fn().mockRejectedValue(new Error('getData error'));
    initStoreDict(store);
    watchStoreDict(store);
    await vi.advanceTimersByTimeAsync(100);
    store.setFieldDict('options', []);
    expect(store.dict.options).toEqual([]);
  }, 10000);

  it('应该正确处理 API 请求出错的情况', async () => {
    const store = new BaseStore();
    store.dictConfig = [
      {
        field: 'options',
        api: () => Promise.reject(new Error('API error')),
      },
    ];
    store.apiExecutor = vi.fn().mockRejectedValue(new Error('API error'));
    initStoreDict(store);
    watchStoreDict(store);
    await vi.advanceTimersByTimeAsync(100);
    store.setFieldDict('options', []);
    expect(store.dict.options).toEqual([]);
  }, 10000);

  describe('watchStoreDict 函数', () => {
    it('应该正确监听字段值变化', () => {
      const mockStore = {
        dictConfig: [{
          type: 'by',
          field: 'options',
          byField: 'type',
          api: { url: '/api/options', params: {} },
        }],
        values: { type: 'test' },
        setFieldDict: vi.fn(),
        setFieldDictLoading: vi.fn(),
        incrDictFetchID: vi.fn(),
        getDictFetchID: vi.fn(),
        apiExecutor: vi.fn(),
        setFieldValue: vi.fn(),
      } as unknown as BaseStore;

      watchStoreDict(mockStore);
      expect(mockStore.values.type).toBe('test');
    });

    it('应该正确处理空值', () => {
      const mockStore = {
        dictConfig: [{
          type: 'by',
          field: 'options',
          byField: 'type',
          api: { url: '/api/options', params: {} },
        }],
        values: { type: null },
        setFieldDict: vi.fn(),
        setFieldDictLoading: vi.fn(),
        incrDictFetchID: vi.fn(),
        getDictFetchID: vi.fn(),
        apiExecutor: vi.fn(),
        setFieldValue: vi.fn(),
      } as unknown as BaseStore;

      watchStoreDict(mockStore);
      expect(mockStore.incrDictFetchID).toHaveBeenCalledWith('options');
    });

    it('应该支持自定义数据获取函数', () => {
      const getData = vi.fn().mockReturnValue([
        { label: '选项1', value: 1 },
        { label: '选项2', value: 2 },
      ]);

      const mockStore = {
        dictConfig: [{
          type: 'by',
          field: 'options',
          byField: 'type',
          getData,
        }],
        values: { type: 'test' },
        setFieldDict: vi.fn(),
        setFieldDictLoading: vi.fn(),
        incrDictFetchID: vi.fn(),
        getDictFetchID: vi.fn(),
        apiExecutor: vi.fn(),
        setFieldValue: vi.fn(),
      } as unknown as BaseStore;

      watchStoreDict(mockStore);
      expect(getData).toHaveBeenCalledWith({ type: 'test' }, mockStore);
      expect(mockStore.setFieldDict).toHaveBeenCalledWith('options', [
        { label: '选项1', value: 1 },
        { label: '选项2', value: 2 },
      ]);
    });

    it('应该正确处理字段值变化的情况', async () => {
      const mockStore = createMockStore({
        values: { type: 1 },
        dict: {
          test: {
            type: 'by',
            field: 'test',
            byField: 'type',
            api: { url: '/test' },
          },
        },
      });
      watchStoreDict(mockStore);
      await vi.runAllTimersAsync();
      mockStore.values.type = 2;
      await vi.runAllTimersAsync();
      expect(mockStore.apiExecutor).toHaveBeenCalledTimes(2);
    });

    it('应该正确处理 getData 函数返回 Promise 失败的情况', async () => {
      const mockStore = createMockStore({
        values: { type: 1 },
        dict: {
          test: {
            type: 'by',
            field: 'test',
            byField: 'type',
            getData: () => Promise.reject(new Error('test error')),
          },
        },
      });
      watchStoreDict(mockStore);
      await vi.runAllTimersAsync();
      expect(mockStore.setFieldDictLoading).toHaveBeenCalledWith('test', false);
    });

    it('应该正确处理 getData 函数返回 Promise 的情况', async () => {
      const mockStore = createMockStore({
        values: { type: 1 },
        dict: {
          test: {
            type: 'by',
            field: 'test',
            byField: 'type',
            getData: () => Promise.resolve([{ id: 1, name: 'test' }]),
          },
        },
      });
      watchStoreDict(mockStore);
      await vi.runAllTimersAsync();
      expect(mockStore.setFieldDictLoading).toHaveBeenCalledWith('test', true);
      expect(mockStore.setFieldDict).toHaveBeenCalledWith('test', [{ id: 1, name: 'test' }]);
      expect(mockStore.setFieldDictLoading).toHaveBeenCalledWith('test', false);
    });

    it('应该正确处理 API 请求成功后的数据处理', async () => {
      const mockStore = createMockStore({
        values: { type: 1 },
        dict: {
          test: {
            type: 'by',
            field: 'test',
            byField: 'type',
            api: { url: '/test' },
            toMap: true,
            keys: { value: 'id', label: 'name' },
          },
        },
      });
      (mockStore.apiExecutor as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        code: 0,
        data: [{ id: 1, name: 'test' }],
      });
      watchStoreDict(mockStore);
      await vi.runAllTimersAsync();
      expect(mockStore.setFieldDict).toHaveBeenCalledWith('test', { 1: 'test' });
    });

    it('应该正确处理 API 请求成功后的数据处理（无 keys 配置）', async () => {
      const mockStore = createMockStore({
        values: { type: 1 },
        dict: {
          test: {
            type: 'by',
            field: 'test',
            byField: 'type',
            api: { url: '/test' },
            toMap: true,
          },
        },
      });
      (mockStore.apiExecutor as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        code: 0,
        data: [{ value: 1, label: 'test' }],
      });
      watchStoreDict(mockStore);
      await vi.runAllTimersAsync();
      expect(mockStore.setFieldDict).toHaveBeenCalledWith('test', { 1: 'test' });
    });

    it('应该正确处理 API 请求失败的情况', async () => {
      const mockStore = createMockStore({
        values: { type: 1 },
        dict: {
          test: {
            type: 'by',
            field: 'test',
            byField: 'type',
            api: { url: '/test' },
          },
        },
      });
      (mockStore.apiExecutor as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('test error'));
      watchStoreDict(mockStore);
      await vi.runAllTimersAsync();
      expect(mockStore.setFieldDictLoading).toHaveBeenCalledWith('test', false);
    });

    it('应该正确处理 API 请求成功后的数据处理（toOptions 为 true）', async () => {
      const mockStore = createMockStore({
        values: { type: 1 },
        dict: {
          test: {
            type: 'by',
            field: 'test',
            byField: 'type',
            api: { url: '/test' },
            toOptions: true,
            keys: { value: 'id', label: 'name' },
          },
        },
      });
      (mockStore.apiExecutor as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        code: 0,
        data: [{ id: 1, name: 'test' }],
      });
      watchStoreDict(mockStore);
      await vi.runAllTimersAsync();
      expect(mockStore.setFieldDict).toHaveBeenCalledWith('test', [{ id: 1, name: 'test' }]);
      expect(mockStore.setFieldDictLoading).toHaveBeenCalledWith('test', false);
    });

    it('应该正确处理 getData 函数返回 Promise 的情况（fetchID 不匹配）', async () => {
      const mockStore = createMockStore({
        values: { type: 1 },
        dict: {
          test: {
            type: 'by',
            field: 'test',
            byField: 'type',
            getData: () => Promise.resolve([{ id: 1, name: 'test' }]),
          },
        },
      });
      // 模拟 fetchID 不匹配的情况
      (mockStore.getDictFetchID as ReturnType<typeof vi.fn>).mockReturnValue(999);
      watchStoreDict(mockStore);
      await vi.runAllTimersAsync();
      expect(mockStore.setFieldDictLoading).toHaveBeenCalledWith('test', true);
      expect(mockStore.setFieldDict).not.toHaveBeenCalled();
    });

    it('应该正确处理 getData 函数返回 Promise 失败的情况（fetchID 不匹配）', async () => {
      const mockStore = createMockStore({
        values: { type: 1 },
        dict: {
          test: {
            type: 'by',
            field: 'test',
            byField: 'type',
            getData: () => Promise.reject(new Error('test error')),
          },
        },
      });
      // 模拟 fetchID 不匹配的情况
      (mockStore.getDictFetchID as ReturnType<typeof vi.fn>).mockReturnValue(999);
      watchStoreDict(mockStore);
      await vi.runAllTimersAsync();
      expect(mockStore.setFieldDictLoading).toHaveBeenCalledWith('test', true);
      expect(mockStore.setFieldDictLoading).not.toHaveBeenCalledWith('test', false);
    });

    it('应该正确处理 getData 函数返回非 Promise 的情况', () => {
      const mockStore = createMockStore({
        values: { type: 1 },
        dict: {
          test: {
            type: 'by',
            field: 'test',
            byField: 'type',
            getData: () => [{ id: 1, name: 'test' }],
          },
        },
      });
      watchStoreDict(mockStore);
      expect(mockStore.setFieldDict).toHaveBeenCalledWith('test', [{ id: 1, name: 'test' }]);
    });

    it('应该正确处理 getData 函数返回 Promise 的情况（新请求在旧请求完成前发起）', async () => {
      const mockStore = createMockStore({
        values: { type: 1 },
        dict: {
          test: {
            type: 'by',
            field: 'test',
            byField: 'type',
            getData: () => new Promise((resolve) => {
              setTimeout(() => {
                resolve([{ id: 1, name: 'test' }]);
              }, 100);
            }),
          },
        },
      });
      let fetchID = 0;
      mockStore.incrDictFetchID = vi.fn(() => {
        fetchID = fetchID + 1;
        return fetchID;
      });
      mockStore.getDictFetchID = vi.fn(() => fetchID);
      const setFieldDictSpy = vi.spyOn(mockStore, 'setFieldDict');
      watchStoreDict(mockStore);
      // 等待第一个请求开始
      await vi.advanceTimersByTime(0);
      // 等待第一个请求完成一半
      await vi.advanceTimersByTime(50);
      // 模拟新的请求
      mockStore.values.type = 2;
      // 等待第一个请求完成
      await vi.advanceTimersByTime(50);
      // 确保 setFieldDict 没有被调用，因为 fetchID 已经改变
      expect(setFieldDictSpy).not.toHaveBeenCalled();
      // 等待第二个请求完成
      await vi.advanceTimersByTime(100);
      // 确保第二个请求的结果被正确处理
      expect(setFieldDictSpy).toHaveBeenCalledWith('test', [{ id: 1, name: 'test' }]);
    });
  });
});

describe('getDictAPIData 函数', () => {
  it('应该正确处理非数组数据的 toMap 情况', () => {
    const data = { id: 1, name: 'test' };
    const dictConf = {
      field: 'test',
      toMap: true,
      toOptions: false,
      keys: { value: 'id', label: 'name' },
    };
    const result = getDictAPIData(data, dictConf);
    expect(result).toEqual(data);
  });

  it('应该正确处理 toOptions 为 false 的情况', () => {
    const data = [{ id: 1, name: 'test' }];
    const dictConf = {
      field: 'test',
      toOptions: false,
      keys: { value: 'id', label: 'name' },
    };
    const result = getDictAPIData(data, dictConf);
    expect(result).toEqual(data);
  });

  it('应该正确处理 toMap 为 true 且数据为数组的情况', () => {
    const data = [{ id: 1, name: 'test' }];
    const dictConf = {
      field: 'test',
      toMap: true,
      keys: { value: 'id', label: 'name' },
    };
    const result = getDictAPIData(data, dictConf);
    expect(result).toEqual({ 1: 'test' });
  });
});

describe('updateValueByDict 函数', () => {
  it('应该在 isUpdateValue 为 false 时不更新值', () => {
    const store = createMockStore({
      values: { test: '1' },
      fieldsConfig: { test: { 'x-splitter': ',' } },
    });
    const config = {
      type: 'by' as const,
      field: 'test',
      byField: 'type',
      isUpdateValue: false,
      keys: { value: 'id', label: 'name' },
    };
    const dict = [{ id: '2', name: 'test2' }];
    updateValueByDict(config, dict, store);
    expect(store.values.test).toBe('1');
  });

  it('应该正确处理数组类型的字段值', () => {
    const store = createMockStore({
      values: { test: ['1', '2', '3'] },
    });
    const config = {
      type: 'by' as const,
      field: 'test',
      byField: 'type',
      keys: { value: 'id', label: 'name' },
    };
    const dict = [
      { id: '1', name: 'test1' },
      { id: '2', name: 'test2' },
    ];
    updateValueByDict(config, dict, store);
    expect(store.values.test).toEqual(['1', '2']);
  });

  it('应该正确处理带分隔符的字符串字段值', () => {
    const store = createMockStore({
      values: { test: '1,2,3' },
      fieldsConfig: { test: { 'x-splitter': ',' } },
    });
    const config = {
      type: 'by' as const,
      field: 'test',
      byField: 'type',
      keys: { value: 'id', label: 'name' },
    };
    const dict = [
      { id: '1', name: 'test1' },
      { id: '2', name: 'test2' },
    ];
    updateValueByDict(config, dict, store);
    expect(store.values.test).toBe('1,2');
  });

  it('应该正确处理单个值的字段值', async () => {
    vi.useFakeTimers();
    const store = new BaseStore({
      defaultValues: { test: '1', type: '2' },
      dictConfig: [{
        type: 'by',
        field: 'test',
        byField: 'type',
        keys: { value: 'id', label: 'name' },
        data: [{ id: '2', name: 'test2' }],
      }],
    });
    initStoreDict(store);
    watchStoreDict(store);
    await vi.runAllTimersAsync();
    expect(store.dict.test).toEqual([{ id: '2', name: 'test2' }]);
    store.setFieldValue('type', '');
    await vi.runAllTimersAsync();
    expect(store.dict.test).toEqual([]);
  });
});
