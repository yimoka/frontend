/**
 * @remarks Root 模块单元测试
 * @author ickeep <i@ickeep.com>
 */

import { describe, it, expect } from 'vitest';

import { RootStore, rootStore } from './root';

describe('Root 模块', () => {
  /**
   * 测试初始化
   */
  describe('初始化', () => {
    it('应该使用默认值初始化', () => {
      const store = new RootStore();
      expect(store.user).toEqual({});
      expect(store.menus).toBeUndefined();
      expect(store.config).toEqual({});
      expect(store.lang).toEqual({});
      expect(store.data).toEqual({});
      expect(store.loading).toBe(false);
    });

    it('应该使用初始值初始化', () => {
      const initVal = {
        user: { name: 'test', age: 18 },
        menus: [{ id: 1, name: 'menu1' }],
        config: { theme: 'dark' },
        lang: { hello: 'world' },
        data: { custom: 'value' },
      };

      const store = new RootStore(initVal);
      expect(store.user).toEqual(initVal.user);
      expect(store.menus).toEqual(initVal.menus);
      expect(store.config).toEqual(initVal.config);
      expect(store.lang).toEqual(initVal.lang);
      expect(store.data).toEqual(initVal.data);
      expect(store.loading).toBe(false);
    });

    it('应该部分初始化', () => {
      const initVal = {
        user: { name: 'test' },
        config: { theme: 'dark' },
      };

      const store = new RootStore(initVal);
      expect(store.user).toEqual(initVal.user);
      expect(store.menus).toBeUndefined();
      expect(store.config).toEqual(initVal.config);
      expect(store.lang).toEqual({});
      expect(store.data).toEqual({});
      expect(store.loading).toBe(false);
    });
  });

  /**
   * 测试用户信息
   */
  describe('用户信息', () => {
    it('应该设置用户信息', () => {
      const store = new RootStore();
      const user = { name: 'test', age: 18 };
      store.setUser(user);
      expect(store.user).toEqual(user);
    });

    it('应该更新用户信息', () => {
      const store = new RootStore();
      store.setUser({ name: 'test' });
      store.setUser({ name: 'test', age: 18 });
      expect(store.user).toEqual({ name: 'test', age: 18 });
    });
  });

  /**
   * 测试菜单列表
   */
  describe('菜单列表', () => {
    it('应该设置菜单列表', () => {
      const store = new RootStore();
      const menus = [{ id: 1, name: 'menu1' }];
      store.setMenus(menus);
      expect(store.menus).toEqual(menus);
    });

    it('应该更新菜单列表', () => {
      const store = new RootStore();
      store.setMenus([{ id: 1, name: 'menu1' }]);
      store.setMenus([{ id: 1, name: 'menu1' }, { id: 2, name: 'menu2' }]);
      expect(store.menus).toEqual([{ id: 1, name: 'menu1' }, { id: 2, name: 'menu2' }]);
    });
  });

  /**
   * 测试系统配置
   */
  describe('系统配置', () => {
    it('应该设置系统配置', () => {
      const store = new RootStore();
      const config = { theme: 'dark', language: 'zh-CN' };
      store.setConfig(config);
      expect(store.config).toEqual(config);
    });

    it('应该更新系统配置', () => {
      const store = new RootStore();
      store.setConfig({ theme: 'light' });
      store.setConfig({ theme: 'dark', language: 'zh-CN' });
      expect(store.config).toEqual({ theme: 'dark', language: 'zh-CN' });
    });
  });

  /**
   * 测试语言包
   */
  describe('语言包', () => {
    it('应该设置语言包', () => {
      const store = new RootStore();
      const lang = { hello: 'world', welcome: '欢迎' };
      store.setLang(lang);
      expect(store.lang).toEqual(lang);
    });

    it('应该更新语言包', () => {
      const store = new RootStore();
      store.setLang({ hello: 'world' });
      store.setLang({ hello: 'world', welcome: '欢迎' });
      expect(store.lang).toEqual({ hello: 'world', welcome: '欢迎' });
    });
  });

  /**
   * 测试自定义数据
   */
  describe('自定义数据', () => {
    it('应该设置自定义数据', () => {
      const store = new RootStore();
      const data = { custom1: 'value1', custom2: 'value2' };
      store.setData(data);
      expect(store.data).toEqual(data);
    });

    it('应该设置自定义数据项', () => {
      const store = new RootStore();
      store.setDataItem('custom1', 'value1');
      expect(store.data).toEqual({ custom1: 'value1' });
    });

    it('应该获取自定义数据项', () => {
      const store = new RootStore();
      store.setDataItem('custom1', 'value1');
      expect(store.getDataItem('custom1')).toBe('value1');
    });

    it('应该更新自定义数据项', () => {
      const store = new RootStore();
      store.setDataItem('custom1', 'value1');
      store.setDataItem('custom1', 'value2');
      expect(store.data).toEqual({ custom1: 'value2' });
    });
  });

  /**
   * 测试加载状态
   */
  describe('加载状态', () => {
    it('应该设置加载状态', () => {
      const store = new RootStore();
      store.setLoading(true);
      expect(store.loading).toBe(true);
    });

    it('应该更新加载状态', () => {
      const store = new RootStore();
      store.setLoading(true);
      store.setLoading(false);
      expect(store.loading).toBe(false);
    });
  });

  /**
   * 测试根存储实例
   */
  describe('根存储实例', () => {
    it('应该创建根存储实例', () => {
      expect(rootStore).toBeInstanceOf(RootStore);
      expect(rootStore.user).toEqual({});
      expect(rootStore.menus).toBeUndefined();
      expect(rootStore.config).toEqual({});
      expect(rootStore.lang).toEqual({});
      expect(rootStore.data).toEqual({});
      expect(rootStore.loading).toBe(false);
    });
  });
});
