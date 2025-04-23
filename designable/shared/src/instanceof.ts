import { IAny } from '@yimoka/shared';

import { globalThisPolyfill } from './globalThisPolyfill';
import { isStr, isFn } from './types';
export const instOf = (value: IAny, cls: IAny) => {
  if (isFn(cls)) return value instanceof cls;
  if (isStr(cls)) return globalThisPolyfill[cls]
    ? value instanceof globalThisPolyfill[cls]
    : false;
  return false;
};
