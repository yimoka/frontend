import { IAny } from '@yimoka/shared';

import { globalThisPolyfill } from './globalThisPolyfill';

export interface IIdleDeadline {
  didTimeout: boolean
  timeRemaining: () => DOMHighResTimeStamp
}

export interface IdleCallbackOptions {
  timeout?: number
}

// 用于setTimeout返回值的类型，避免使用NodeJS.Timeout
type TimeoutHandle = ReturnType<typeof setTimeout>;

// 使用一个更简单的方法避免类型冲突
// 不再扩展Window接口，而是简单地使用类型断言

// 实现requestIdleCallback的polyfill
const requestIdleCallbackPolyfill = (
  callback: (deadline: IIdleDeadline) => void,
  options?: IdleCallbackOptions,
): number => {
  const startTime = Date.now();
  // 使用类型断言强制转换setTimeout返回值为number
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - startTime)),
    });
  }, options?.timeout || 1) as unknown as number;
};

// 使用可用的requestIdleCallback或polyfill
export const requestIdle = (
  callback: (params: IIdleDeadline) => void,
  options?: IdleCallbackOptions,
): number => {
  // 使用类型断言来避免类型检查错误
  if (typeof (globalThisPolyfill as IAny).requestIdleCallback === 'function') {
    return (globalThisPolyfill as IAny).requestIdleCallback(callback, options);
  }
  return requestIdleCallbackPolyfill(callback, options);
};

export const cancelIdle = (id: number): void => {
  // 使用类型断言来避免类型检查错误
  if (typeof (globalThisPolyfill as IAny).cancelIdleCallback === 'function') {
    (globalThisPolyfill as IAny).cancelIdleCallback(id);
  } else {
    // 使用明确的类型
    clearTimeout(id as unknown as TimeoutHandle);
  }
};
