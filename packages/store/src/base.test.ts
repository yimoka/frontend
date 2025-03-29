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

      // 开始第一次请求并等待它开始
      await baseStore.fetch();
      // 等待一段时间确保第一次请求已经开始
      await new Promise(resolve => setTimeout(resolve, 50));
      // 开始第二次请求，这应该会取消第一次请求
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
      baseStore.off('test', listener);
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
      baseStore.emitFetchSuccess({ data: { name: 'test' } }, baseStore);
      expect(listener).toHaveBeenCalledWith({ data: { name: 'test' } }, baseStore);
    });

    it('应该正确移除获取成功监听器', () => {
      const listener = vi.fn();
      baseStore.onFetchSuccess(listener);
      baseStore.offFetchSuccess(listener);
      baseStore.emitFetchSuccess({ data: { name: 'test' } }, baseStore);
      expect(listener).not.toHaveBeenCalled();
    });

    it('应该正确触发获取成功事件', () => {
      const listener = vi.fn();
      baseStore.onFetchSuccess(listener);
      const response = { data: { name: 'test' } };
      baseStore.emitFetchSuccess(response, baseStore);
      expect(listener).toHaveBeenCalledWith(response, baseStore);
    });

    it('应该正确触发获取成功事件，即使没有监听器', () => {
      const response = { data: { name: 'test' } };
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

  it('应该使用默认值正确初始化', () => {
    expect(store.values).toEqual({ name: '张三', age: 18 });
  });

  it('应该正确设置值', () => {
    store.setValues({ name: '李四' });
    expect(store.values).toEqual({ name: '李四', age: 18 });
  });

  it('当策略为覆盖时应该正确覆盖值', () => {
    store.setValues({ gender: '男' }, 'overwrite');
    expect(store.values).toEqual({ gender: '男' });
  });

  it('当策略为合并时应该正确合并值', () => {
    store.setValues({ gender: '男' }, 'merge');
    expect(store.values).toEqual({ name: '张三', age: 18, gender: '男' });
  });

  it('当策略为浅合并时应该正确浅合并值', () => {
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

  it('应该正确合并数组值', () => {
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

  it('应该正确重置值为默认值', () => {
    store.setValues({ name: '李四', age: 20 });
    store.resetValues();
    expect(store.values).toEqual({ name: '张三', age: 18 });
  });

  it('应该正确按字段设置值', () => {
    store.setFieldValue('name', '王五');
    expect(store.values.name).toBe('王五');
  });

  it('应该正确按字段设置值并应用策略', () => {
    expect(store.values.name).toBe('张三');
    store.setFieldValue('name', '王五');
    expect(store.values.name).toBe('王五');
  });

  it('应该正确设置带点的字段值', () => {
    store.setFieldValue('info.address', '北京');
    expect(store.values.info?.address).toBe('北京');
  });

  it('应该正确设置数组字段值', () => {
    store.setFieldValue('tags[1]', 'b');
    expect(store.values.tags?.[1]).toBe('b');
  });

  it('应该正确从路由搜索字符串设置值', () => {
    store.setValuesFromRoute('?name=李四&age=20');
    expect(store.values).toEqual({ name: '李四', age: 20 });
  });

  it('应该正确从路由搜索对象设置值', () => {
    store.setValuesFromRoute({ name: '李四', age: 20 });
    expect(store.values).toEqual({ name: '李四', age: 20 });
  });

  it('应该正确从路由参数对象设置值', () => {
    store.setValuesFromRoute('', { name: '李四', age: 20 });
    expect(store.values).toEqual({ name: '李四', age: 20 });
  });

  it('应该正确从路由搜索和参数对象设置值', () => {
    store.setValuesFromRoute({ name: '李四' }, { age: 20 });
    expect(store.values).toEqual({ name: '李四', age: 20 });
  });

  it('当 resetMissingValues 为 true 时应该重置缺失的值', () => {
    store.setValuesFromRoute({ name: '李四' }, {}, true);
    expect(store.values).toEqual({ name: '李四', age: 18 });
  });

  it('当 resetMissingValues 为 false 时不应该重置缺失的值', () => {
    store.setValuesFromRoute({ name: '李四' }, {}, false);
    expect(store.values).toEqual({ name: '李四', age: 18 });
    store.setFieldValue('age', 20);
    store.setValuesFromRoute({ name: '李四' }, {}, false);
    expect(store.values).toEqual({ name: '李四', age: 20 });
  });

  it('当调用 resetValues 时应该重置值为默认值', () => {
    store.setValues({ name: '李四', age: 20, gender: '男' });
    store.resetValues();
    expect(store.values).toEqual({ name: '张三', age: 18 });
  });

  it('应该正确重置指定字段为默认值', () => {
    store.setValues({ name: '李四', age: 20, gender: '男' });
    store.resetFieldsValue(['name', 'gender']);
    expect(store.values).toEqual({ name: '张三', age: 20, gender: '男' });
  });

  it('应该正确重置单个字段为默认值', () => {
    store.setValues({ name: '李四', age: 20, gender: '男' });
    store.resetFieldsValue('name');
    expect(store.values).toEqual({ name: '张三', age: 20, gender: '男' });
    store.resetFieldsValue(['age']);
    expect(store.values).toEqual({ name: '张三', age: 18, gender: '男' });
  });

  it('应该正确重置嵌套字段为默认值', () => {
    const curStore = new BaseStore<IUser>({ defaultValues: { name: '张三', age: 18, info: { address: '北京' } } });
    curStore.setFieldValue('info.address', '上海');
    curStore.resetFieldsValue('info.address');
    expect(curStore.values.info?.address).toBe('北京');
  });

  it('应该正确生成 URL 搜索字符串', () => {
    store.setValues({ name: '李四', age: 20, gender: '男' });
    const searchString = store.genURLSearch();
    expect(searchString).toBe('name=%E6%9D%8E%E5%9B%9B&age=20&gender=%E7%94%B7');
  });

  it('应该正确生成包含嵌套对象的 URL 搜索字符串', () => {
    store.setValues({ name: '李四', age: 20, info: { address: '北京' } });
    const searchString = store.genURLSearch();
    expect(searchString).toBe('name=%E6%9D%8E%E5%9B%9B&age=20&info=%7B%22address%22%3A%22%E5%8C%97%E4%BA%AC%22%7D');
  });

  it('应该正确生成包含数组的 URL 搜索字符串', () => {
    store.setValues({ name: '李四', age: 20, tags: ['a', 'b'] });
    const searchString = store.genURLSearch();
    expect(searchString).toBe('name=%E6%9D%8E%E5%9B%9B&age=20&tags=%5B%22a%22%2C%22b%22%5D');
  });

  it('当没有设置值时应该从默认值生成 URL 搜索字符串', () => {
    const searchString = store.genURLSearch();
    expect(searchString).toBe('');
    store.options.urlWithDefaultFields = ['name'];
    expect(store.genURLSearch()).toBe('name=%E5%BC%A0%E4%B8%89');
    store.options.urlWithDefaultFields = ['name', 'age'];
    expect(store.genURLSearch()).toBe('name=%E5%BC%A0%E4%B8%89&age=18');
    store.setValues({ gender: undefined });
    store.options.urlWithDefaultFields = ['name', 'age', 'gender'];
    expect(store.genURLSearch()).toBe('name=%E5%BC%A0%E4%B8%89&age=18');
  });

  it('应该正确增加字典获取 ID', () => {
    const field = 'name';
    const initialID = store.getDictFetchID(field);
    const newID = store.incrDictFetchID(field);
    expect(newID).toBe(initialID + 1);
    expect(store.getDictFetchID(field)).toBe(newID);
  });

  it('应该为不同字段独立增加字典获取 ID', () => {
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

  it('应该正确设置字典数据', () => {
    const dictData = { name: ['张三', '李四'], age: [18, 20] };
    store.setDict(dictData);
    expect(store.dict).toEqual(dictData);
  });

  it('应该正确设置字段字典数据', () => {
    const field = 'name';
    const dictData = ['张三', '李四'];
    store.setFieldDict(field, dictData);
    expect(store.dict[field]).toEqual(dictData);
  });

  it('应该正确设置字段字典加载状态', () => {
    const field = 'name';
    store.setFieldDictLoading(field, true);
    expect(store.dictLoading[field]).toBe(true);
    store.setFieldDictLoading(field, false);
    expect(store.dictLoading[field]).toBe(false);
  });

  it('应该正确设置加载状态', () => {
    store.setLoading(true);
    expect(store.loading).toBe(true);
    store.setLoading(false);
    expect(store.loading).toBe(false);
  });

  it('应该正确设置响应数据', () => {
    const responseData = { data: { name: '李四', age: 20 }, status: 200 };
    store.setResponse(responseData);
    expect(store.response).toEqual(responseData);
  });

  it('应该正确设置响应数据并保持加载状态', () => {
    const responseData = { data: { name: '李四', age: 20 }, status: 200 };
    store.setLoading(true);
    store.setResponse(responseData);
    expect(store.response).toEqual(responseData);
    expect(store.loading).toBe(true);
    store.setLoading(false);
    expect(store.loading).toBe(false);
  });

  it('应该正确设置和获取扩展信息', () => {
    store.setExtInfo('extraData', 'testValue');
    expect(store.getExtInfo('extraData')).toBe('testValue');
  });

  it('应该正确设置和获取嵌套扩展信息', () => {
    store.setExtInfo('nested.data', 'nestedValue');
    expect(store.getExtInfo('nested.data')).toBe('nestedValue');
  });

  it('应该正确设置和获取数组扩展信息', () => {
    store.setExtInfo('arrayData[0]', 'arrayValue');
    expect(store.getExtInfo('arrayData[0]')).toBe('arrayValue');
  });

  it('应该正确覆盖扩展信息', () => {
    store.setExtInfo('extraData', 'initialValue');
    store.setExtInfo('extraData', 'newValue');
    expect(store.getExtInfo('extraData')).toBe('newValue');
  });

  it('应该优雅处理不存在的扩展信息键', () => {
    expect(store.getExtInfo('nonExistingKey')).toBeUndefined();
  });

  it('当调用 fetch 时应该正确设置加载状态', async () => {
    store.api = vi.fn().mockResolvedValue({ data: { name: '李四', age: 20 }, status: 200 });
    await store.fetch();
    expect(store.loading).toBe(false);
  });

  it('当调用 fetch 时应该正确设置响应数据', async () => {
    const responseData = { code: 0, msg: '', data: { name: '李四', age: 20 }, status: 200 };
    store.api = vi.fn().mockResolvedValue(responseData);
    await store.fetch();
    expect(store.response).toEqual(responseData);
  });

  it('如果提供了 apiExecutor 应该正确调用它', async () => {
    const apiExecutor = vi.fn((params?: Record<string, unknown>) => Promise.resolve({ code: 0, msg: '', data: params?.data }));
    store.apiExecutor = apiExecutor;
    store.api = { url: 'test' };
    await store.fetch();
    expect(apiExecutor).toHaveBeenCalledTimes(1);
  });

  it('当调用新的 fetch 时应该取消之前的请求', async () => {
    const abortSpy = vi.spyOn(AbortController.prototype, 'abort');
    const apiExecutor = vi.fn((params?: Record<string, unknown>) => new Promise<IHTTPResponse<Record<string, unknown>, Record<string, unknown>>>((resolve) => {
      setTimeout(() => {
        resolve({ code: params?.code as number ?? 0, msg: '', data: params?.data as Record<string, unknown> });
      }, 100);
    }));
    store.apiExecutor = apiExecutor;
    store.api = { url: 'test' };

    // 开始第一次请求并等待它开始
    await store.fetch();
    // 等待一段时间确保第一次请求已经开始
    await new Promise(resolve => setTimeout(resolve, 50));
    // 开始第二次请求，这应该会取消第一次请求
    await store.fetch();

    expect(abortSpy).toHaveBeenCalled();
  });

  it('当 filterBlankAtRun 为 true 时应该过滤空值', async () => {
    store.options.filterBlankAtRun = true;
    store.api = vi.fn().mockResolvedValue({ data: { name: '李四', age: 20 }, status: 200 });
    store.setValues({ name: '', age: 20 });
    await store.fetch();
    expect(store.api).toHaveBeenCalledWith({ age: 20 });
  });

  it('当 filterBlankAtRun 为 false 时不应该过滤空值', async () => {
    store.options.filterBlankAtRun = false;
    store.api = vi.fn().mockResolvedValue({ data: { name: '李四', age: 20 }, status: 200 });
    store.setValues({ name: '', age: 20 });
    await store.fetch();
    expect(store.api).toHaveBeenCalledWith({ name: '', age: 20 });
  });

  it('应该根据 afterAtFetch.resetValues 配置重置值', async () => {
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

  it('应该根据 afterAtFetch.notify 配置发送通知', async () => {
    const notify = vi.fn();
    store.notifier = notify;

    store.afterAtFetch = { notify: true };
    store.api = vi.fn().mockResolvedValue({ code: 0, msg: '', data: { name: '李四', age: 20 }, status: 200 });
    await store.fetch();
    expect(notify).toHaveBeenCalled();

    store.afterAtFetch = { notify: '自定义消息' };
    await store.fetch();
    expect(notify.mock.calls[1][1]).toBe('自定义消息');
  });

  it('应该根据 afterAtFetch.failNotify 配置发送失败通知', async () => {
    const notify = vi.fn();
    store.notifier = notify;

    store.afterAtFetch = { failNotify: true };
    store.api = vi.fn().mockResolvedValue({ code: 1, msg: 'Error', data: null, status: 500 });
    await store.fetch().catch(() => { });
    expect(notify).toHaveBeenCalled();

    store.afterAtFetch = { failNotify: '自定义错误消息' };
    await store.fetch().catch(() => { });
    expect(notify.mock.calls[1][1]).toBe('自定义错误消息');
  });

  it('应该根据 afterAtFetch.successNotify 配置发送成功通知', async () => {
    const notify = vi.fn();
    store.notifier = notify;

    store.afterAtFetch = { successNotify: true };
    store.api = vi.fn().mockResolvedValue({ code: 0, msg: '', data: { name: '李四', age: 20 }, status: 200 });
    await store.fetch();
    expect(notify).toHaveBeenCalled();

    store.afterAtFetch = { successNotify: '自定义成功消息' };
    await store.fetch();
    expect(notify.mock.calls[1][1]).toBe('自定义成功消息');
  });

  it('应该根据 afterAtFetch.run 配置执行自定义函数', async () => {
    const customFn = vi.fn();
    store.afterAtFetch = { run: customFn };
    const res = { code: 0, msg: '', data: { name: '李四', age: 20 }, status: 200 };
    store.api = vi.fn().mockResolvedValue(res);
    await store.fetch();
    expect(customFn).toHaveBeenCalledWith(res, store);
  });

  it('应该根据 afterAtFetch.failRun 配置执行自定义失败函数', async () => {
    const customFn = vi.fn();
    store.afterAtFetch = { failRun: customFn };
    const res = { code: 1, msg: 'Error', data: null, status: 500 };
    store.api = vi.fn().mockResolvedValue(res);
    await store.fetch().catch(() => { });
    expect(customFn).toHaveBeenCalledWith(res, store);
  });

  it('应该根据 afterAtFetch.successRun 配置执行自定义成功函数', async () => {
    const customFn = vi.fn();
    store.afterAtFetch = { successRun: customFn };
    const res = { code: 0, msg: '', data: { name: '李四', age: 20 }, status: 200 };
    store.api = vi.fn().mockResolvedValue(res);
    await store.fetch();
    expect(customFn).toHaveBeenCalledWith(res, store);
  });

  it('afterAtFetch 的默认值应该是 undefined', async () => {
    expect(store.afterAtFetch.run).toBeUndefined();
    const curStore = new BaseStore<IUser>({ defaultValues: { name: '张三', age: 18 }, afterAtFetch: { run: vi.fn() } });
    const res = { code: 0, msg: '', data: { name: '李四', age: 20 }, status: 200 };
    curStore.api = vi.fn().mockResolvedValue(res);
    await curStore.fetch();
    expect(curStore.afterAtFetch.run).toHaveBeenCalled();
  });

  it('应该处理小程序 new URLSearchParams() 报错的问题', async () => {
    vi.spyOn(globalThis, 'URLSearchParams').mockImplementation(() => {
      throw new Error('URLSearchParams is not a constructor');
    });
    store.setValuesFromRoute('?name=李四&age=20');
    expect(store.values).toEqual({ name: '张三', age: 18 });
    const search = store.genURLSearch();
    expect(search).toBe('');
  });

  it('应该处理 AbortController 错误', async () => {
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


