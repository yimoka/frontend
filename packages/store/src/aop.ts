import { IHTTPResponse, isBlank, isSuccess } from '@yimoka/shared';

import { BaseStore } from './base';

export const handleAfterAtFetch = (res: Partial<IHTTPResponse>, store: BaseStore) => {
  handleResetValues(res, store);
  handleAfterAtFetchRun(res, store);
  handleAfterAtFetchNotify(res, store);
};

const handleResetValues = (res: Partial<IHTTPResponse>, store: BaseStore) => {
  const { resetValues } = store.afterAtFetch;
  const reset = () => {
    store.resetValues();
    // 清除表单错误
    store.form?.clearErrors();
  };
  if (resetValues === true) {
    reset();
  }
  if (isSuccess(res)) {
    if (resetValues === 'success') {
      reset();
    };
  } else {
    if (resetValues === 'fail') {
      reset();
    }
  }
};

const handleAfterAtFetchRun = (res: Partial<IHTTPResponse>, store: BaseStore) => {
  const { run, failRun, successRun } = store.afterAtFetch;
  const runFn = (fn: IAfterAtFetch['run']) => typeof fn === 'function' && fn(res, store);
  runFn(run);
  if (isSuccess(res)) {
    runFn(successRun);
  } else {
    runFn(failRun);
  };
};

const handleAfterAtFetchNotify = (res: Partial<IHTTPResponse>, store: BaseStore) => {
  const { notify, failNotify: notifyOnFail = notify, successNotify: notifyOnSuccess = notify } = store.afterAtFetch;
  const getMsg = (notify: true | string, df?: string) => {
    const msg = notify === true ? res.msg : notify;
    return isBlank(msg) ? df : msg;
  };
  if (isSuccess(res)) {
    if (notifyOnSuccess) {
      store.notifier?.('success', getMsg(notifyOnSuccess, '成功了'));
    };
  } else {
    if (notifyOnFail) {
      store.notifier?.('error', getMsg(notifyOnFail, '出错了'));
    };
  }
};

export type IAfterAtFetchFn = (res: Partial<IHTTPResponse>, store: BaseStore) => void;

export interface IAfterAtFetch {
  resetValues?: boolean | 'success' | 'fail';
  notify?: boolean | string
  failNotify?: boolean | string
  successNotify?: boolean | string
  run?: IAfterAtFetchFn
  failRun?: IAfterAtFetchFn
  successRun?: IAfterAtFetchFn
}

// 操作类型 store 的 afterAtFetch 配置
export const opStoreAfterAtFetch: IAfterAtFetch = {
  resetValues: 'success',
  notify: true,
};
