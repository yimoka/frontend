import { IAny } from '@yimoka/shared';

import { globalThisPolyfill } from './globalThisPolyfill';
import { isStr, isFn } from './types';

export const instOf = (value: IAny, cls: IAny) => {
  if (isFn(cls)) return value instanceof cls;
  if (isStr(cls)) {
    const globalCls = (globalThisPolyfill as Record<string, IAny>)[cls as string];
    return globalCls ? value instanceof globalCls : false;
  }
  return false;
};
