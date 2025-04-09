import { IAny } from '@yimoka/shared';
import { useMemo } from 'react';

export const useArrayStringTransform = <T = string | IAny[]>(value?: T, splitter = ',', toArray = true): T | undefined => useMemo(() => {
  if (typeof value === 'undefined') {
    return undefined;
  }
  if (typeof value === 'string') {
    return (toArray ? value.split(splitter) : value) as T;
  }
  if (Array.isArray(value)) {
    return (toArray ? value : value.join(splitter)) as T;
  }
  return (toArray ? [] : '') as T;
}, [splitter, value, toArray]);
