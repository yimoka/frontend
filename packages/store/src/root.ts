/**
 * @remarks 根存储模块，用于管理全局状态
 * @author ickeep <i@ickeep.com>
 * @module root
 */

import { action, define, observable } from '@formily/reactive';
import { IAny, IAnyObject } from '@yimoka/shared';

/**
 * 根存储类
 * @class RootStore
 * @remarks 用于管理全局状态，包括用户信息、菜单、配置、语言等
 * @template U - 用户信息类型
 * @template M - 菜单类型
 * @template D - 自定义数据类型
 * @template C - 配置类型
 * @template L - 语言类型
 */
export class RootStore<
  U extends object = IAnyObject,
  M extends Array<IAnyObject> = Array<IAnyObject>,
  D extends object = IAnyObject,
  C extends object = IAnyObject,
  L extends object = IAnyObject
> {
  /** 用户信息 */
  user: U = Object({});
  /** 菜单列表 */
  menus?: M;
  /** 系统配置 */
  config: IAnyObject = Object({});
  /** 语言包 */
  lang: IAnyObject = Object({});

  /** 自定义数据存储 */
  data: D = Object({});

  /** 加载状态 */
  loading = false;

  /**
   * 创建根存储实例
   * @param initVal - 初始值
   * @remarks 初始化根存储，设置响应式属性和方法
   */
  constructor(initVal?: IRootInitVal<U, M, D, C, L>) {
    define(this, {
      user: observable.shallow,
      menus: observable.shallow,
      config: observable.shallow,
      lang: observable.shallow,

      data: observable,
      loading: observable,

      setUser: action,
      setMenus: action,
      setConfig: action,
      setLang: action,

      setData: action,
      setDataItem: action,

      setLoading: action,
    });

    if (initVal) {
      this.init(initVal);
    }
  }

  /** 设置用户信息 */
  setUser = (user: U) => this.user = user;

  /** 设置菜单列表 */
  setMenus = (menus: M) => this.menus = menus;

  /** 设置系统配置 */
  setConfig = (config: C) => this.config = config;

  /** 设置语言包 */
  setLang = (lang: L) => this.lang = lang;

  /** 设置自定义数据 */
  setData = (data: D) => this.data = data;

  /** 设置自定义数据项 */
  setDataItem = (name: keyof D, value: IAny) => this.data[name] = value;

  /** 获取自定义数据项 */
  getDataItem = (name: keyof D) => this.data[name];

  /** 设置加载状态 */
  setLoading = (loading: boolean) => this.loading = loading;

  /**
   * 初始化根存储
   * @param value - 初始值
   * @remarks 根据提供的初始值初始化根存储的各项数据
   */
  init = (value: IRootInitVal<U, M, D, C, L>) => {
    const { user, menus, data, config, lang } = value;
    if (user) {
      this.setUser(user);
    }
    if (menus) {
      this.setMenus(menus);
    }
    if (data) {
      this.setData(data);
    }
    if (config) {
      this.setConfig(config);
    }
    if (lang) {
      this.setLang(lang);
    }
  };
}

/** 根存储实例 */
export const rootStore = new RootStore();

/**
 * 根存储初始值接口
 * @interface IRootInitVal
 * @remarks 定义根存储初始化值的类型
 * @template U - 用户信息类型
 * @template M - 菜单类型
 * @template D - 自定义数据类型
 * @template C - 配置类型
 * @template L - 语言类型
 */
export interface IRootInitVal<
  U extends object = IAnyObject,
  M extends Array<IAnyObject> = Array<IAnyObject>,
  D extends object = IAnyObject,
  C extends object = IAnyObject,
  L extends object = IAnyObject> {
  /** 用户信息 */
  user?: U,
  /** 菜单列表 */
  menus?: M,
  /** 自定义数据 */
  data?: D,
  /** 系统配置 */
  config?: C,
  /** 语言包 */
  lang?: L,
}
