/**
 * @file aop.ts
 * @remarks AOP 模块，提供数据获取后的处理功能，包括重置值、执行回调、显示通知等
 * @author ickeep <i@ickeep.com>
 * @module @yimoka/store
 */

import { IHTTPResponse, isSuccess } from '@yimoka/shared';

import { BaseStore } from './base';

/**
 * 处理数据获取后的操作
 * @param res - HTTP 响应数据
 * @param store - 存储实例
 * @remarks 按顺序执行重置值、执行回调、显示通知等操作
 * @example
 * ```ts
 * const store = new BaseStore({
 *   afterAtFetch: {
 *     resetValues: 'success',
 *     notify: true,
 *     successRun: (res) => {
 *       console.log('数据获取成功:', res);
 *     }
 *   }
 * });
 * ```
 */
export const handleAfterAtFetch = (res: Partial<IHTTPResponse>, store: BaseStore) => {
  handleResetValues(res, store);
  handleAfterAtFetchRun(res, store);
  handleAfterAtFetchNotify(res, store);
};

/**
 * 处理重置值的操作
 * @param res - HTTP 响应数据
 * @param store - 存储实例
 * @remarks 根据配置和响应状态决定是否重置表单值
 */
const handleResetValues = (res: Partial<IHTTPResponse>, store: BaseStore) => {
  const { resetValues } = store.afterAtFetch;
  const reset = () => {
    store.resetValues?.();
    store.form?.clearErrors();
  };

  if (resetValues === true) {
    reset();
    return;
  }

  if (isSuccess(res)) {
    if (resetValues === 'success') {
      reset();
    }
  } else if (resetValues === 'fail') {
    reset();
  }
};

/**
 * 处理数据获取后的回调函数
 * @param res - HTTP 响应数据
 * @param store - 存储实例
 * @remarks 根据响应状态执行相应的回调函数
 */
const handleAfterAtFetchRun = (res: Partial<IHTTPResponse>, store: BaseStore) => {
  const { run, failRun, successRun } = store.afterAtFetch;

  if (typeof run === 'function') {
    run(res, store);
  }

  if (isSuccess(res)) {
    if (typeof successRun === 'function') {
      successRun(res, store);
    }
  } else if (typeof failRun === 'function') {
    failRun(res, store);
  }
};

/**
 * 处理数据获取后的通知
 * @param res - HTTP 响应数据
 * @param store - 存储实例
 * @remarks 根据响应状态显示相应的通知消息
 */
const handleAfterAtFetchNotify = (res: Partial<IHTTPResponse>, store: BaseStore) => {
  const { notify, failNotify: notifyOnFail = notify, successNotify: notifyOnSuccess = notify } = store.afterAtFetch;

  const getMsg = (notify: boolean | string | undefined, df: string): string => {
    if (!notify) return '';
    if (notify === true) return res.msg || df;
    return notify;
  };

  const success = res.success ?? isSuccess(res);
  if (success) {
    const msg = getMsg(notifyOnSuccess, '成功了');
    if (msg && store.notifier) {
      store.notifier('success', msg);
    }
  } else {
    const msg = getMsg(notifyOnFail, '出错了');
    if (msg && store.notifier) {
      store.notifier('error', msg);
    }
  }
};

/**
 * 数据获取后的回调函数类型
 * @param res - HTTP 响应数据
 * @param store - 存储实例
 */
export type IAfterAtFetchFn = (res: Partial<IHTTPResponse>, store: BaseStore) => void;

/**
 * 数据获取后的处理配置接口
 */
export interface IAfterAtFetch {
  /** 重置值的时机 */
  resetValues?: boolean | 'success' | 'fail';
  /** 通知消息 */
  notify?: boolean | string;
  /** 失败时的通知消息 */
  failNotify?: boolean | string;
  /** 成功时的通知消息 */
  successNotify?: boolean | string;
  /** 通用回调函数 */
  run?: IAfterAtFetchFn;
  /** 失败时的回调函数 */
  failRun?: IAfterAtFetchFn;
  /** 成功时的回调函数 */
  successRun?: IAfterAtFetchFn;
}

/**
 * 操作类型存储的默认 afterAtFetch 配置
 * @remarks 默认在成功时重置值并显示通知
 */
export const opStoreAfterAtFetch: IAfterAtFetch = {
  resetValues: 'success',
  notify: true,
};
