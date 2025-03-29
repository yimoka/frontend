/// <reference types="node" />

/**
 * @file base.test.ts
 * @description BaseStore 模块单元测试
 * @author ickeep <i@ickeep.com>
 * @version 3ab441b - 2025-03-29
 * @module @yimoka/store
 */

import { IAnyObject, IHTTPResponse } from '@yimoka/shared';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { IStoreResponse } from './api';
import { BaseStore } from './base';

interface IUser {
  name: string;
  age: number;
  gender?: string;
  info?: IAnyObject;
  tags?: string[];
}

describe('BaseStore 模块', () => {
  let baseStore: BaseStore;

  beforeEach(() => {
    baseStore = new BaseStore();
    vi.restoreAllMocks();
  });

  describe('构造函数', () => {
    it('应该正确初始化默认值', () => {
      const defaultValues = { name: 'test', age: 18 };
      const store = new BaseStore({ defaultValues });
      expect(store.defaultValues).toEqual(defaultValues);
    });

    it('应该正确初始化字段配置', () => {
      const fieldsConfig = { name: { type: 'string' } };
      const store = new BaseStore({ fieldsConfig });
      expect(store.fieldsConfig).toEqual(fieldsConfig);
    });

    it('应该正确初始化字典配置', () => {
      const dictConfig = [{ field: 'type', data: [{ label: '类型1', value: 1 }] }];
      const store = new BaseStore({ dictConfig });
      expect(store.dictConfig).toEqual(dictConfig);
    });

    it('应该正确初始化 API 配置', () => {
      const api = { url: '/api/test', method: 'GET' };
      const store = new BaseStore({ api });
      expect(store.api).toEqual(api);
    });

    it('应该正确初始化选项', () => {
      const options = { filterBlankAtRun: true, bindRoute: true };
      const store = new BaseStore({ options });
      expect(store.options.filterBlankAtRun).toBe(true);
      expect(store.options.bindRoute).toBe(true);
    });

    it('应该正确初始化扩展信息', () => {
      const extInfo = { key: 'value' };
      const store = new BaseStore({ extInfo });
      expect(store.extInfo).toEqual(extInfo);
    });

    it('应该在 runNow 为 true 且 bindRoute 为 false 时立即执行 fetch', async () => {
      const apiMock = vi.fn();
      new BaseStore({ options: { runNow: true, bindRoute: false }, api: apiMock });
      expect(apiMock).toHaveBeenCalledTimes(1);
    });

    it('不应该在 runNow 为 true 但 bindRoute 为 true 时立即执行 fetch', async () => {
      const apiMock = vi.fn();
      new BaseStore({ options: { runNow: true, bindRoute: true }, api: apiMock });
      expect(apiMock).not.toHaveBeenCalled();
    });
  });

  describe('表单值管理', () => {
    it('应该正确获取表单值', () => {
      const defaultValues = { name: 'test', age: 18 };
      const store = new BaseStore({ defaultValues });
      expect(store.values).toEqual(defaultValues);
    });

    it('应该正确设置表单值', () => {
      const store = new BaseStore({ defaultValues: { name: 'test', age: 18 } });
      store.setValues({ name: 'new' });
      expect(store.values).toEqual({ name: 'new', age: 18 });
    });

    it('应该正确设置字段值', () => {
      const store = new BaseStore({ defaultValues: { name: 'test', age: 18 } });
      store.setFieldValue('name', 'new');
      expect(store.values.name).toBe('new');
    });

    it('应该正确重置表单值', () => {
      const defaultValues = { name: 'test', age: 18 };
      const store = new BaseStore({ defaultValues });
      store.setValues({ name: 'new' });
      store.resetValues();
      expect(store.values).toEqual(defaultValues);
    });

    it('应该正确重置字段值', () => {
      const defaultValues = { name: 'test', age: 18 };
      const store = new BaseStore({ defaultValues });
      store.setFieldValue('name', 'new');
      store.resetFieldsValue('name');
      expect(store.values.name).toBe('test');
    });
  });

  describe('字典管理', () => {
    it('应该正确设置字典数据', () => {
      const dict = { type: [{ label: '类型1', value: 1 }] };
      baseStore.setDict(dict);
      expect(baseStore.dict).toEqual(dict);
    });

    it('应该正确设置字段字典数据', () => {
      baseStore.setFieldDict('type', [{ label: '类型1', value: 1 }]);
      expect(baseStore.dict.type).toEqual([{ label: '类型1', value: 1 }]);
    });

    it('应该正确设置字段字典加载状态', () => {
      baseStore.setFieldDictLoading('type', true);
      expect(baseStore.dictLoading.type).toBe(true);
    });

    it('应该正确增加字典请求 ID', () => {
      baseStore.incrDictFetchID('type');
      expect(baseStore.getDictFetchID('type')).toBe(1);
    });
  });

  describe('API 请求', () => {
    it('应该正确设置加载状态', () => {
      baseStore.setLoading(true);
      expect(baseStore.loading).toBe(true);
    });

    it('应该正确设置响应数据', () => {
      const response: IStoreResponse<IAnyObject, IAnyObject> = {
        data: { name: 'test' },
        success: true,
      };
      baseStore.setResponse(response);
      expect(baseStore.response).toEqual(response);
    });

    it('应该正确取消请求', async () => {
      const mockAbort = vi.spyOn(AbortController.prototype, 'abort');
      const apiExecutor = vi.fn((params?: Record<string, unknown>) => new Promise<IHTTPResponse<Record<string, unknown>, IAnyObject>>((resolve) => {
        setTimeout(() => {
          resolve({ code: params?.code as number ?? 0, msg: '', data: params as Record<string, unknown> });
        }, 100);
      }));
      baseStore.apiExecutor = apiExecutor;
      baseStore.api = { url: 'test' };

      // Start first fetch and wait for it to start
      await baseStore.fetch();
      // Wait a bit to ensure first fetch has started
      await new Promise(resolve => setTimeout(resolve, 50));
      // Start second fetch which should abort the first one
      await baseStore.fetch();

      expect(mockAbort).toHaveBeenCalled();
    });
  });

  describe('事件管理', () => {
    it('应该正确添加事件监听器', () => {
      const listener = vi.fn();
      baseStore.on('test', listener);
      baseStore.emit('test', 'data');
      expect(listener).toHaveBeenCalledWith('data');
    });

    it('应该正确移除事件监听器', () => {
      const listener = vi.fn();
      baseStore.on('test', listener);
      baseStore.off('test', listener);
      baseStore.emit('test', 'data');
      expect(listener).not.toHaveBeenCalled();
    });

    it('应该正确触发事件', () => {
      const listener = vi.fn();
      baseStore.on('test', listener);
      baseStore.emit('test', 'data');
      expect(listener).toHaveBeenCalledWith('data');
    });

    it('应该正确添加获取成功监听器', () => {
      const listener = vi.fn();
      baseStore.onFetchSuccess(listener);
      baseStore.emitFetchSuccess({ data: { name: 'test' }, success: true }, baseStore);
      expect(listener).toHaveBeenCalledWith({ data: { name: 'test' }, success: true }, baseStore);
    });

    it('应该正确移除获取成功监听器', () => {
      const listener = vi.fn();
      baseStore.onFetchSuccess(listener);
      baseStore.offFetchSuccess(listener);
      baseStore.emitFetchSuccess({ data: { name: 'test' }, success: true }, baseStore);
      expect(listener).not.toHaveBeenCalled();
    });

    it('应该正确触发获取成功事件', () => {
      const listener = vi.fn();
      baseStore.onFetchSuccess(listener);
      const response = { data: { name: 'test' }, success: true };
      baseStore.emitFetchSuccess(response, baseStore);
      expect(listener).toHaveBeenCalledWith(response, baseStore);
    });

    it('应该正确触发获取成功事件，即使没有监听器', () => {
      const response = { data: { name: 'test' }, success: true };
      // 确保没有监听器的情况下也能正常触发事件
      expect(() => baseStore.emitFetchSuccess(response, baseStore)).not.toThrow();
    });

    it('应该正确添加获取失败监听器', () => {
      const listener = vi.fn();
      baseStore.onFetchError(listener);
      baseStore.emitFetchError({ data: { name: 'test' }, success: false }, baseStore);
      expect(listener).toHaveBeenCalledWith({ data: { name: 'test' }, success: false }, baseStore);
    });

    it('应该正确移除获取失败监听器', () => {
      const listener = vi.fn();
      baseStore.onFetchError(listener);
      baseStore.offFetchError(listener);
      baseStore.emitFetchError({ data: { name: 'test' }, success: false }, baseStore);
      expect(listener).not.toHaveBeenCalled();
    });

    it('应该正确触发获取失败事件', () => {
      const listener = vi.fn();
      baseStore.onFetchError(listener);
      const response = { data: { name: 'test' }, success: false };
      baseStore.emitFetchError(response, baseStore);
      expect(listener).toHaveBeenCalledWith(response, baseStore);
    });
  });

  describe('扩展信息管理', () => {
    it('应该正确设置扩展信息', () => {
      baseStore.setExtInfo('key', 'value');
      expect(baseStore.getExtInfo('key')).toBe('value');
    });

    it('应该正确获取扩展信息', () => {
      baseStore.setExtInfo('key', 'value');
      expect(baseStore.getExtInfo('key')).toBe('value');
    });
  });

  let store: BaseStore<IUser>;
  beforeEach(() => {
    store = new BaseStore<IUser>({ defaultValues: { name: '张三', age: 18 } });
  });

  it('should initialize with default values', () => {
    expect(store.values).toEqual({ name: '张三', age: 18 });
  });

  it('should set values correctly', () => {
    store.setValues({ name: '李四' });
    expect(store.values).toEqual({ name: '李四', age: 18 });
  });

  it('should overwrite values when strategy is overwrite', () => {
    store.setValues({ gender: '男' }, 'overwrite');
    expect(store.values).toEqual({ gender: '男' });
  });

  it('should merge values when strategy is merge', () => {
    store.setValues({ gender: '男' }, 'merge');
    expect(store.values).toEqual({ name: '张三', age: 18, gender: '男' });
  });

  it('should shallow merge values when strategy is shallowMerge', () => {
    store.setValues({
      name: '李四',
      info: { address: '北京' },
    });
    store.setValues({ info: { phone: '123' } }, 'shallowMerge');
    expect(store.values).toEqual({
      name: '李四',
      age: 18,
      info: { phone: '123' },
    });
    store.setValues({ info: { address: '上海' } }, 'merge');
    expect(store.values).toEqual({
      name: '李四',
      age: 18,
      info: { address: '上海', phone: '123' },
    });
  });

  it('should merge array values', () => {
    store.setValues({ tags: ['a', 'b'] });
    store.setValues({ tags: ['c'] });
    expect(store.values).toEqual({ name: '张三', age: 18, tags: ['c'] });
    store.setValues({ tags: ['c'] }, 'merge');
    expect(store.values).toEqual({ name: '张三', age: 18, tags: ['c'] });
    store.setValues({ tags: ['a', 'b'] });
    store.setValues({ tags: ['c'] }, 'shallowMerge');
    expect(store.values).toEqual({ name: '张三', age: 18, tags: ['c'] });
    store.setValues({ tags: ['a', 'b'] });
  });

  it('should reset values to default', () => {
    store.setValues({ name: '李四', age: 20 });
    store.resetValues();
    expect(store.values).toEqual({ name: '张三', age: 18 });
  });

  it('should set values by field', () => {
    store.setFieldValue('name', '王五');
    expect(store.values.name).toBe('王五');
  });

  it('should set values by field with strategy', () => {
    expect(store.values.name).toBe('张三');
    store.setFieldValue('name', '王五');
    expect(store.values.name).toBe('王五');
  });
  it('should set values by field with dot', () => {
    store.setFieldValue('info.address', '北京');
    expect(store.values.info?.address).toBe('北京');
  });
  it('should set values by field with array', () => {
    store.setFieldValue('tags[1]', 'b');
    expect(store.values.tags?.[1]).toBe('b');
  });

  it('should set values from route with search string', () => {
    store.setValuesFromRoute('?name=李四&age=20');
    expect(store.values).toEqual({ name: '李四', age: 20 });
  });

  it('should set values from route with search object', () => {
    store.setValuesFromRoute({ name: '李四', age: 20 });
    expect(store.values).toEqual({ name: '李四', age: 20 });
  });

  it('should set values from route with params object', () => {
    store.setValuesFromRoute('', { name: '李四', age: 20 });
    expect(store.values).toEqual({ name: '李四', age: 20 });
  });

  it('should set values from route with search and params object', () => {
    store.setValuesFromRoute({ name: '李四' }, { age: 20 });
    expect(store.values).toEqual({ name: '李四', age: 20 });
  });

  it('should reset missing values when resetMissingValues is true', () => {
    store.setValuesFromRoute({ name: '李四' }, {}, true);
    expect(store.values).toEqual({ name: '李四', age: 18 });
  });

  it('should not reset missing values when resetMissingValues is false', () => {
    store.setValuesFromRoute({ name: '李四' }, {}, false);
    expect(store.values).toEqual({ name: '李四', age: 18 });
    store.setFieldValue('age', 20);
    store.setValuesFromRoute({ name: '李四' }, {}, false);
    expect(store.values).toEqual({ name: '李四', age: 20 });
  });
  it('should reset values to default when resetValues is called', () => {
    store.setValues({ name: '李四', age: 20, gender: '男' });
    store.resetValues();
    expect(store.values).toEqual({ name: '张三', age: 18 });
  });

  it('should reset specific fields to default values', () => {
    store.setValues({ name: '李四', age: 20, gender: '男' });
    store.resetFieldsValue(['name', 'gender']);
    expect(store.values).toEqual({ name: '张三', age: 20, gender: '男' });
  });

  it('should reset a single field to default value', () => {
    store.setValues({ name: '李四', age: 20, gender: '男' });
    store.resetFieldsValue('name');
    expect(store.values).toEqual({ name: '张三', age: 20, gender: '男' });
    store.resetFieldsValue(['age']);
    expect(store.values).toEqual({ name: '张三', age: 18, gender: '男' });
  });

  it('should reset a single field to default value', () => {
    const curStore = new BaseStore<IUser>({ defaultValues: { name: '张三', age: 18, info: { address: '北京' } } });
    curStore.setFieldValue('info.address', '上海');
    curStore.resetFieldsValue('info.address');
    expect(curStore.values.info?.address).toBe('北京');
  });
  it('should generate URL search string from values', () => {
    store.setValues({ name: '李四', age: 20, gender: '男' });
    const searchString = store.genURLSearch();
    expect(searchString).toBe('name=%E6%9D%8E%E5%9B%9B&age=20&gender=%E7%94%B7');
  });

  it('should generate URL search string from values with nested objects', () => {
    store.setValues({ name: '李四', age: 20, info: { address: '北京' } });
    const searchString = store.genURLSearch();
    expect(searchString).toBe('name=%E6%9D%8E%E5%9B%9B&age=20&info=%7B%22address%22%3A%22%E5%8C%97%E4%BA%AC%22%7D');
  });

  it('should generate URL search string from values with arrays', () => {
    store.setValues({ name: '李四', age: 20, tags: ['a', 'b'] });
    const searchString = store.genURLSearch();
    expect(searchString).toBe('name=%E6%9D%8E%E5%9B%9B&age=20&tags=%5B%22a%22%2C%22b%22%5D');
  });

  it('should generate URL search string from default values when no values are set', () => {
    const searchString = store.genURLSearch();
    expect(searchString).toBe('');
    store.options.urlWithDefaultFields = ['name'];
    expect(store.genURLSearch()).toBe('name=%E5%BC%A0%E4%B8%89');
    store.options.urlWithDefaultFields = ['name', 'age'];
    expect(store.genURLSearch()).toBe('name=%E5%BC%A0%E4%B8%89&age=18');
  });

  it('should increment dict fetch ID', () => {
    const field = 'name';
    const initialID = store.getDictFetchID(field);
    const newID = store.incrDictFetchID(field);
    expect(newID).toBe(initialID + 1);
    expect(store.getDictFetchID(field)).toBe(newID);
  });

  it('should increment dict fetch ID for different fields independently', () => {
    const field1 = 'name';
    const field2 = 'age';
    const initialID1 = store.getDictFetchID(field1);
    const initialID2 = store.getDictFetchID(field2);
    const newID1 = store.incrDictFetchID(field1);
    const newID2 = store.incrDictFetchID(field2);
    expect(newID1).toBe(initialID1 + 1);
    expect(newID2).toBe(initialID2 + 1);
    expect(store.getDictFetchID(field1)).toBe(newID1);
    expect(store.getDictFetchID(field2)).toBe(newID2);
  });

  it('should set dictionary data', () => {
    const dictData = { name: ['张三', '李四'], age: [18, 20] };
    store.setDict(dictData);
    expect(store.dict).toEqual(dictData);
  });

  it('should set field dictionary data', () => {
    const field = 'name';
    const dictData = ['张三', '李四'];
    store.setFieldDict(field, dictData);
    expect(store.dict[field]).toEqual(dictData);
  });

  it('should set field dictionary loading state', () => {
    const field = 'name';
    store.setFieldDictLoading(field, true);
    expect(store.dictLoading[field]).toBe(true);
    store.setFieldDictLoading(field, false);
    expect(store.dictLoading[field]).toBe(false);
  });

  it('should set loading state', () => {
    store.setLoading(true);
    expect(store.loading).toBe(true);
    store.setLoading(false);
    expect(store.loading).toBe(false);
  });

  it('should set response data', () => {
    const responseData = { data: { name: '李四', age: 20 }, status: 200 };
    store.setResponse(responseData);
    expect(store.response).toEqual(responseData);
  });

  it('should set response data and maintain loading state', () => {
    const responseData = { data: { name: '李四', age: 20 }, status: 200 };
    store.setLoading(true);
    store.setResponse(responseData);
    expect(store.response).toEqual(responseData);
    expect(store.loading).toBe(true);
    store.setLoading(false);
    expect(store.loading).toBe(false);
  });

  it('should set and get extInfo correctly', () => {
    store.setExtInfo('extraData', 'testValue');
    expect(store.getExtInfo('extraData')).toBe('testValue');
  });

  it('should set and get nested extInfo correctly', () => {
    store.setExtInfo('nested.data', 'nestedValue');
    expect(store.getExtInfo('nested.data')).toBe('nestedValue');
  });

  it('should set and get extInfo with array correctly', () => {
    store.setExtInfo('arrayData[0]', 'arrayValue');
    expect(store.getExtInfo('arrayData[0]')).toBe('arrayValue');
  });

  it('should overwrite extInfo correctly', () => {
    store.setExtInfo('extraData', 'initialValue');
    store.setExtInfo('extraData', 'newValue');
    expect(store.getExtInfo('extraData')).toBe('newValue');
  });

  it('should handle non-existing extInfo keys gracefully', () => {
    expect(store.getExtInfo('nonExistingKey')).toBeUndefined();
  });

  it('should set loading state to true when fetch is called', async () => {
    store.api = vi.fn().mockResolvedValue({ data: { name: '李四', age: 20 }, status: 200 });
    await store.fetch();
    expect(store.loading).toBe(false);
  });

  it('should set response data when fetch is called', async () => {
    const responseData = { code: 0, msg: '', data: { name: '李四', age: 20 }, status: 200 };
    store.api = vi.fn().mockResolvedValue(responseData);
    await store.fetch();
    expect(store.response).toEqual(responseData);
  });

  it('should call apiExecutor if provided', async () => {
    const apiExecutor = vi.fn((params?: Record<string, unknown>) => Promise.resolve({ code: 0, msg: '', data: params?.data }));
    store.apiExecutor = apiExecutor;
    store.api = { url: 'test' };
    await store.fetch();
    expect(apiExecutor).toHaveBeenCalledTimes(1);
  });

  it('should abort previous fetch if new fetch is called', async () => {
    const abortSpy = vi.spyOn(AbortController.prototype, 'abort');
    const apiExecutor = vi.fn((params?: Record<string, unknown>) => new Promise<IHTTPResponse<Record<string, unknown>, Record<string, unknown>>>((resolve) => {
      setTimeout(() => {
        resolve({ code: params?.code as number ?? 0, msg: '', data: params?.data as Record<string, unknown> });
      }, 100);
    }));
    store.apiExecutor = apiExecutor;
    store.api = { url: 'test' };

    // Start first fetch and wait for it to start
    await store.fetch();
    // Wait a bit to ensure first fetch has started
    await new Promise(resolve => setTimeout(resolve, 50));
    // Start second fetch which should abort the first one
    await store.fetch();

    expect(abortSpy).toHaveBeenCalled();
  });

  it('should filter blank values if filterBlankAtRun is true', async () => {
    store.options.filterBlankAtRun = true;
    store.api = vi.fn().mockResolvedValue({ data: { name: '李四', age: 20 }, status: 200 });
    store.setValues({ name: '', age: 20 });
    await store.fetch();
    expect(store.api).toHaveBeenCalledWith({ age: 20 });
  });

  it('should not filter blank values if filterBlankAtRun is false', async () => {
    store.options.filterBlankAtRun = false;
    store.api = vi.fn().mockResolvedValue({ data: { name: '李四', age: 20 }, status: 200 });
    store.setValues({ name: '', age: 20 });
    await store.fetch();
    expect(store.api).toHaveBeenCalledWith({ name: '', age: 20 });
  });

  it('should reset values based on afterAtFetch.resetValues configuration', async () => {
    store.api = vi.fn().mockResolvedValue({ code: 0, msg: '', data: { name: '李四', age: 20 }, status: 200 });
    store.setValues({ name: '王五', age: 25 });
    await store.fetch();
    expect(store.values).toEqual({ name: '王五', age: 25 });
    store.afterAtFetch = { resetValues: 'success' };
    await store.fetch();
    expect(store.values).toEqual({ name: '张三', age: 18 });


    store.afterAtFetch = { resetValues: 'fail' };
    store.api = vi.fn().mockResolvedValue({ code: 1, msg: 'Error', data: null, status: 500 });
    store.setValues({ name: '王五', age: 25 });
    await store.fetch();
    expect(store.values).toEqual({ name: '张三', age: 18 });

    store.afterAtFetch = { resetValues: true };
    store.api = vi.fn().mockResolvedValue({ code: 0, msg: '', data: { name: '李四', age: 20 }, status: 200 });
    store.setValues({ name: '王五', age: 25 });
    await store.fetch();
    expect(store.values).toEqual({ name: '张三', age: 18 });

    store.afterAtFetch = { resetValues: false };
    store.api = vi.fn().mockResolvedValue({ code: 1, msg: 'Error', data: null, status: 500 });
    store.setValues({ name: '王五', age: 25 });
    await store.fetch();
    expect(store.values).toEqual({ name: '王五', age: 25 });
  });

  it('should notify based on afterAtFetch.notify configuration', async () => {
    const notify = vi.fn();
    store.notifier = notify;

    store.afterAtFetch = { notify: true };
    store.api = vi.fn().mockResolvedValue({ code: 0, msg: '', data: { name: '李四', age: 20 }, status: 200 });
    await store.fetch();
    expect(notify).toHaveBeenCalled();

    store.afterAtFetch = { notify: 'Custom message' };
    await store.fetch();
    // 只需要判断第一个参数是否为notify的值
    expect(notify.mock.calls[1][1]).toBe('Custom message');
  });

  it('should notify based on afterAtFetch.failNotify configuration', async () => {
    const notify = vi.fn();
    store.notifier = notify;

    store.afterAtFetch = { failNotify: true };
    store.api = vi.fn().mockResolvedValue({ code: 1, msg: 'Error', data: null, status: 500 });
    await store.fetch().catch(() => { });
    expect(notify).toHaveBeenCalled();

    store.afterAtFetch = { failNotify: 'Custom error message' };
    await store.fetch().catch(() => { });
    expect(notify.mock.calls[1][1]).toBe('Custom error message');
  });

  it('should notify based on afterAtFetch.successNotify configuration', async () => {
    const notify = vi.fn();
    store.notifier = notify;

    store.afterAtFetch = { successNotify: true };
    store.api = vi.fn().mockResolvedValue({ code: 0, msg: '', data: { name: '李四', age: 20 }, status: 200 });
    await store.fetch();
    expect(notify).toHaveBeenCalled();

    store.afterAtFetch = { successNotify: 'Custom success message' };
    await store.fetch();
    expect(notify.mock.calls[1][1]).toBe('Custom success message');
  });

  it('should run custom function based on afterAtFetch.run configuration', async () => {
    const customFn = vi.fn();
    store.afterAtFetch = { run: customFn };
    const res = { code: 0, msg: '', data: { name: '李四', age: 20 }, status: 200 };
    store.api = vi.fn().mockResolvedValue(res);
    await store.fetch();
    expect(customFn).toHaveBeenCalledWith(res, store);
  });

  it('should run custom function based on afterAtFetch.failRun configuration', async () => {
    const customFn = vi.fn();
    store.afterAtFetch = { failRun: customFn };
    const res = { code: 1, msg: 'Error', data: null, status: 500 };
    store.api = vi.fn().mockResolvedValue(res);
    await store.fetch().catch(() => { });
    expect(customFn).toHaveBeenCalledWith(res, store);
  });

  it('should run custom function based on afterAtFetch.successRun configuration', async () => {
    const customFn = vi.fn();
    store.afterAtFetch = { successRun: customFn };
    const res = { code: 0, msg: '', data: { name: '李四', age: 20 }, status: 200 };
    store.api = vi.fn().mockResolvedValue(res);
    await store.fetch();
    expect(customFn).toHaveBeenCalledWith(res, store);
  });


  it('should notify based on afterAtFetch.notify configuration', async () => {
    const notify = vi.fn();
    store.notifier = notify;

    store.afterAtFetch.notify = true;
    store.api = vi.fn().mockResolvedValue({ code: 0, msg: '', data: { name: '李四', age: 20 }, status: 200 });
    await store.fetch();
    expect(notify).toHaveBeenCalled();

    store.afterAtFetch.notify = 'Custom message';
    await store.fetch();
    expect(notify.mock.calls[1][1]).toBe('Custom message');
  });

  it('should notify based on afterAtFetch.failNotify configuration', async () => {
    const notify = vi.fn();
    store.notifier = notify;

    store.afterAtFetch.failNotify = true;
    store.api = vi.fn().mockResolvedValue({ code: 1, msg: 'Error', data: null, status: 500 });
    await store.fetch().catch(() => { });
    expect(notify).toHaveBeenCalled();

    store.afterAtFetch.failNotify = 'Custom error message';
    await store.fetch().catch(() => { });
    expect(notify.mock.calls[1][1]).toBe('Custom error message');
  });

  it('should notify based on afterAtFetch.successNotify configuration', async () => {
    const notify = vi.fn();
    store.notifier = notify;

    store.afterAtFetch.successNotify = true;
    store.api = vi.fn().mockResolvedValue({ code: 0, msg: '', data: { name: '李四', age: 20 }, status: 200 });
    await store.fetch();
    expect(notify).toHaveBeenCalled();

    store.afterAtFetch.successNotify = 'Custom success message';
    await store.fetch();
    expect(notify.mock.calls[1][1]).toBe('Custom success message');
  });

  // afterAtFetch 默认的值为 undefined
  it('should run custom function based on afterAtFetch.run configuration', async () => {
    expect(store.afterAtFetch.run).toBeUndefined();
    const curStore = new BaseStore<IUser>({ defaultValues: { name: '张三', age: 18 }, afterAtFetch: { run: vi.fn() } });
    const res = { code: 0, msg: '', data: { name: '李四', age: 20 }, status: 200 };
    curStore.api = vi.fn().mockResolvedValue(res);
    await curStore.fetch();
    expect(curStore.afterAtFetch.run).toHaveBeenCalled();
  });

  it('处理 小程序 new URLSearchParams() 报错的问题', async () => {
    vi.spyOn(globalThis, 'URLSearchParams').mockImplementation(() => {
      throw new Error('URLSearchParams is not a constructor');
    });
    store.setValuesFromRoute('?name=李四&age=20');
    expect(store.values).toEqual({ name: '张三', age: 18 });
    const search = store.genURLSearch();
    expect(search).toBe('');
  });

  it('处理 AbortController error', async () => {
    vi.spyOn(globalThis, 'AbortController').mockImplementation(() => {
      throw new Error('AbortController is not a constructor');
    });
    const apiExecutor = vi.fn((params?: Record<string, unknown>) => Promise.resolve({ code: Number(params?.code ?? 0), msg: '', data: params?.data }));
    store.apiExecutor = apiExecutor;
    store.api = { url: 'test' };
    await store.fetch();
    expect(store.loading).toBe(false);
  });
});


