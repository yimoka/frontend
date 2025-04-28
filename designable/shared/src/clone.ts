import { IAny } from '@yimoka/shared';

import { instOf } from './instanceof';
import { isFn } from './types';
type Filter = (value: IAny, key: string) => boolean

const NATIVE_KEYS = [
  ['Map', (map: IAny) => new Map(map)],
  ['WeakMap', (map: IAny) => new WeakMap(map)],
  ['WeakSet', (set: IAny) => new WeakSet(set)],
  ['Set', (set: IAny) => new Set(set)],
  ['Date', (date: IAny) => new Date(date)],
  'FileList',
  'File',
  'URL',
  'RegExp',
  [
    'Promise',
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    (promise: Promise<IAny>) => new Promise((resolve, reject) => promise.then(resolve, reject)),
  ],
];

const isNativeObject = (values: IAny): IAny => {
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < NATIVE_KEYS.length; i++) {
    const item = NATIVE_KEYS[i];
    if (Array.isArray(item) && item[0]) {
      if (instOf(values, item[0])) {
        return item[1] ? item[1] : item[0];
      }
    } else {
      if (instOf(values, item)) {
        return item;
      }
    }
  }
};

export const shallowClone = (values: IAny): IAny => {
  let nativeClone: (values: IAny) => IAny;
  if (Array.isArray(values)) {
    return values.slice(0);
  } if (isNativeObject(values)) {
    nativeClone = isNativeObject(values);
    return isFn(nativeClone) ? nativeClone(values) : values;
  } if (typeof values === 'object' && !!values) {
    return {
      ...values,
    };
  }
  return values;
};

// eslint-disable-next-line complexity
export const clone = (values: IAny, filter?: Filter): IAny => {
  let nativeClone: (values: IAny) => IAny;
  if (Array.isArray(values)) {
    return values.map(item => clone(item, filter));
  } if (isNativeObject(values)) {
    nativeClone = isNativeObject(values);
    return isFn(nativeClone) ? nativeClone(values) : values;
  } if (typeof values === 'object' && !!values) {
    if ('$$typeof' in values && '_owner' in values) {
      return values;
    }
    // eslint-disable-next-line no-underscore-dangle
    if (values._isAMomentObject) {
      return values;
    }
    // eslint-disable-next-line no-underscore-dangle
    if (values._isJSONSchemaObject) {
      return values;
    }

    if (isFn(values.toJS)) {
      return values;
    }
    if (isFn(values.toJSON)) {
      return values;
    }
    if (Object.getOwnPropertySymbols(values || {}).length) {
      return values;
    }
    const res: Record<string, IAny> = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const key in values) {
      if (Object.hasOwnProperty.call(values, key)) {
        if (isFn(filter)) {
          if (filter(values[key], key)) {
            res[key] = clone(values[key], filter);
          } else {
            res[key] = values[key];
          }
        } else {
          res[key] = clone(values[key], filter);
        }
      }
    }
    return res;
  }
  return values;
};
