/**
 * @file entity.test.ts
 * @description Entity 模块单元测试
 * @author ickeep <i@ickeep.com>
 * @version 3ab441b - 2025-03-29
 * @module @yimoka/store
 */

import { describe, it, expect } from 'vitest';

import { BaseStore } from './base';
import { getEntryStore, IEntityConfig } from './entity';
import { IFieldConfig } from './field';

import { IStoreConfig } from '.';

describe('Entity 模块', () => {
  describe('getEntryStore', () => {
    it('应该返回 BaseStore 实例', () => {
      const store = new BaseStore();
      const result = getEntryStore(store);
      expect(result).toBe(store);
    });

    it('应该返回空配置对象', () => {
      const result = getEntryStore({});
      expect(result.fieldsConfig).toEqual({});
    });

    it('应该正确合并字段配置', () => {
      const config: IEntityConfig = {
        fieldsConfig: {
          name: { type: 'string' } satisfies IFieldConfig,
        },
      };
      const store: IStoreConfig = {
        fieldsConfig: {
          age: { type: 'number' } satisfies IFieldConfig,
        },
      };
      const result = getEntryStore(store, 'add', config);
      expect(result.fieldsConfig).toEqual({
        name: { type: 'string' },
        age: { type: 'number' },
      });
    });

    it('应该正确合并默认值', () => {
      const config: IEntityConfig = {
        defaultFormValues: {
          name: 'test',
        },
      };
      const store: IStoreConfig = {
        defaultValues: {
          age: 18,
        },
      };
      const result = getEntryStore(store, 'add', config);
      expect(result.defaultValues).toEqual({
        name: 'test',
        age: 18,
      });
    });

    it('应该正确合并 afterAtFetch 配置', () => {
      const config: IEntityConfig = {
        api: {
          add: { url: '/api/add' },
        },
      };
      const store = {
        afterAtFetch: {
          notify: false,
        },
      };
      const result = getEntryStore(store, 'add', config);
      expect(result.afterAtFetch).toEqual({
        resetValues: 'success',
        notify: false,
      });
    });

    it('应该正确设置存储类型', () => {
      const config: IEntityConfig = {
        api: {
          list: { url: '/api/list' },
        },
      };
      const store = {};
      const result = getEntryStore(store, 'list', config);
      expect((result as IStoreConfig).type).toBe('list');
    });

    it('应该正确设置 API 配置', () => {
      const config: IEntityConfig = {
        api: {
          add: { url: '/api/add' },
          edit: { url: '/api/edit' },
        },
      };
      const store = {};
      const result = getEntryStore(store, 'add', config);
      expect(result.api).toEqual({ url: '/api/add' });
    });

    it('应该正确处理详情模式', () => {
      const config: IEntityConfig = {
        idKey: 'id',
        defaultDetailValues: {
          name: 'test',
        },
      };
      const store = {};
      const result = getEntryStore(store, 'detail', config);
      expect(result.defaultValues).toEqual({
        name: 'test',
        id: undefined,
      });
    });

    it('应该正确处理操作模式', () => {
      const config: IEntityConfig = {
        api: {
          del: { url: '/api/del' },
        },
      };
      const store = {};
      const result = getEntryStore(store, 'del', config, true);
      expect(result.afterAtFetch).toEqual({
        resetValues: 'success',
        notify: true,
      });
    });

    it('应该正确处理查询模式', () => {
      const config: IEntityConfig = {
        defaultQueryValues: {
          status: 1,
          keyword: '',
        },
      };
      const store = {};
      const result = getEntryStore(store, 'query', config);
      expect(result.defaultValues).toEqual({
        status: 1,
        keyword: '',
      });
      expect((result as IStoreConfig).type).toBe('list');
    });

    it('应该正确处理自定义 idKey', () => {
      const config: IEntityConfig = {
        idKey: 'userId',
        defaultDetailValues: {
          name: 'test',
        },
      };
      const store = {};
      const result = getEntryStore(store, 'detail', config);
      expect(result.defaultValues).toEqual({
        name: 'test',
        userId: undefined,
      });
    });

    it('应该正确处理空配置和空模式', () => {
      const result = getEntryStore();
      expect(result.fieldsConfig).toEqual({});
    });

    it('应该正确处理编辑模式', () => {
      const config: IEntityConfig = {
        defaultFormValues: {
          name: 'test',
        },
      };
      const store = {};
      const result = getEntryStore(store, 'edit', config);
      expect(result.defaultValues).toEqual({
        name: 'test',
      });
      expect(result.afterAtFetch).toEqual({
        resetValues: 'success',
        notify: true,
      });
    });

    it('应该正确处理列表模式', () => {
      const config: IEntityConfig = {
        defaultQueryValues: {
          page: 1,
          pageSize: 10,
        },
      };
      const store = {};
      const result = getEntryStore(store, 'list', config);
      expect(result.defaultValues).toEqual({
        page: 1,
        pageSize: 10,
      });
      expect((result as IStoreConfig).type).toBe('list');
    });

    it('应该正确处理已存在的 API 配置', () => {
      const config: IEntityConfig = {
        api: {
          add: { url: '/api/add' },
        },
      };
      const store = {
        api: { url: '/api/existing' },
      };
      const result = getEntryStore(store, 'add', config);
      expect(result.api).toEqual({ url: '/api/existing' });
    });
  });
});
