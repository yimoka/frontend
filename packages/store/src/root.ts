import { action, define, observable } from '@formily/reactive';
import { IAny, IAnyObject } from '@yimoka/shared';

// 全局数据管理
export class RootStore<
  U extends object = IAnyObject,
  M extends Array<IAnyObject> = Array<IAnyObject>,
  D extends object = IAnyObject,
  C extends object = IAnyObject,
  L extends object = IAnyObject
> {
  // 预定义常见数据
  user: U = Object({});
  menus?: M;
  config: IAnyObject = Object({});
  lang: IAnyObject = Object({});

  // 用于存放自定义数据
  data: D = Object({});

  loading = false;

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

  setUser = (user: U) => this.user = user;

  setMenus = (menus: M) => this.menus = menus;

  setConfig = (config: C) => this.config = config;

  setLang = (lang: L) => this.lang = lang;

  setData = (data: D) => this.data = data;

  setDataItem = (name: keyof D, value: IAny) => this.data[name] = value;

  getDataItem = (name: keyof D) => this.data[name];

  setLoading = (loading: boolean) => this.loading = loading;

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

export interface IRootInitVal<
  U extends object = IAnyObject,
  M extends Array<IAnyObject> = Array<IAnyObject>,
  D extends object = IAnyObject,
  C extends object = IAnyObject,
  L extends object = IAnyObject> {
  user?: U,
  menus?: M,
  data?: D,
  config?: C,
  lang?: L,
}
