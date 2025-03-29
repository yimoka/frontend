/**
 * @file dict.test.ts
 * @description Dict 模块单元测试
 * @author ickeep <i@ickeep.com>
 * @version 3ab441b - 2025-03-29
 * @module @yimoka/store
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { BaseStore } from './base';
import { initStoreDict, watchStoreDict } from './dict';

describe('Dict 模块', () => {
  let store: BaseStore;

  beforeEach(() => {
    store = new BaseStore();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize store dict', () => {
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

  it('should handle empty dict config', () => {
    store.dictConfig = [];
    initStoreDict(store);
    expect(store.dict).toEqual({});
  });

  it('should handle dict config with API', async () => {
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

  it('should handle dict config with getData function', () => {
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

  it('should handle dict config with async getData function', async () => {
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

  it('should handle dict config with by type', () => {
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

  it('should handle dict config with by type and multiple fields', () => {
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

  it('should handle dict config with toMap option', async () => {
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

  it('should handle dict config with custom keys', async () => {
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

  it('should handle dict config with isEmptyGetData option', async () => {
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

  it('should handle dict config with error in getData', async () => {
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

  it('should handle dict config with error in API', async () => {
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

  describe('watchStoreDict', () => {
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
  });
});
