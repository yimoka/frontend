import { IHTTPResponse, isBlank, isSuccess } from '@yimoka/shared';

import { BaseStore } from './base';

export const handleAfterAtRun = (res: Partial<IHTTPResponse>, store: BaseStore) => {
  handleResetValues(res, store);
  handleAfterAtRunRun(res, store);
  handleAfterAtRunNotify(res, store);
};

const handleResetValues = (res: Partial<IHTTPResponse>, store: BaseStore) => {
  const { resetValues } = store.afterAtRun;
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

const handleAfterAtRunRun = (res: Partial<IHTTPResponse>, store: BaseStore) => {
  const { run, failRun: runOnFail, successRun: runOnSuccess } = store.afterAtRun;
  const runFn = (fn: IAfterAtRun['run']) => typeof fn === 'function' && fn(res, store);
  runFn(run);
  if (isSuccess(res)) {
    runFn(runOnSuccess);
  } else {
    runFn(runOnFail);
  };
};

const handleAfterAtRunNotify = (res: Partial<IHTTPResponse>, store: BaseStore) => {
  const { notify, failNotify: notifyOnFail = notify, successNotify: notifyOnSuccess = notify } = store.afterAtRun;
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

export type IAfterAtRunFn = (res: Partial<IHTTPResponse>, store: BaseStore) => void;

export interface IAfterAtRun {
  resetValues?: boolean | 'success' | 'fail';
  notify?: boolean | string
  failNotify?: boolean | string
  successNotify?: boolean | string
  run?: IAfterAtRunFn
  failRun?: IAfterAtRunFn
  successRun?: IAfterAtRunFn
}
