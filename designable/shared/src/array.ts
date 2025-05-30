import { IAny, IAnyObject } from '@yimoka/shared';

import { isArr, isObj, isStr } from './types';

type EachArrayIterator<T> = (currentValue: T, key: number) => void | boolean
type EachStringIterator = (currentValue: string, key: number) => void | boolean
type EachObjectIterator<T = IAny> = (
  currentValue: T,
  key: string
) => void | boolean
type MapArrayIterator<TItem, TResult> = (
  currentValue: TItem,
  key: number
) => TResult
type MapStringIterator<TResult> = (currentValue: string, key: number) => TResult
type MapObjectIterator<TItem, TResult> = (
  currentValue: TItem,
  key: string
) => TResult
type MemoArrayIterator<T, U> = (
  previousValue: U,
  currentValue: T,
  key: number
) => U
type MemoStringIterator<T> = (
  previousValue: T,
  currentValue: string,
  key: number
) => T
type MemoObjectIterator<TValue, TResult> = (
  previousValue: TResult,
  currentValue: TValue,
  key: string
) => TResult

export const toArr = (val: IAny): IAny[] => {
  if (isArr(val)) return val;
  return val ? [val] : [];
};

export function each(
  val: string,
  iterator: EachStringIterator,
  revert?: boolean
): void
export function each<T>(
  val: T[],
  iterator: EachArrayIterator<T>,
  revert?: boolean
): void
export function each<T extends IAnyObject, _TValue = T[keyof T]>(
  val: T,
  iterator: EachObjectIterator<_TValue>,
  revert?: boolean
): void

// eslint-disable-next-line complexity
export function each(val: IAny, iterator: IAny, revert?: boolean): void {
  if (isArr(val) || isStr(val)) {
    if (revert) {
      for (let i: number = val.length - 1; i >= 0; i--) {
        if (iterator(val[i], i) === false) {
          return;
        }
      }
    } else {
      for (let i = 0; i < val.length; i++) {
        if (iterator(val[i], i) === false) {
          return;
        }
      }
    }
  } else if (isObj(val)) {
    let key: string;
    // eslint-disable-next-line no-restricted-syntax
    for (key in val) {
      if (Object.hasOwnProperty.call(val, key)) {
        if (iterator((val as Record<string, IAny>)[key], key) === false) {
          return;
        }
      }
    }
  }
}

export function map<T>(
  val: string,
  iterator: MapStringIterator<T>,
  revert?: boolean
): IAny
export function map<TItem, TResult>(
  val: TItem[],
  iterator: MapArrayIterator<TItem, TResult>,
  revert?: boolean
): IAny
export function map<T extends IAnyObject, TResult>(
  val: T,
  iterator: MapObjectIterator<T[keyof T], TResult>,
  revert?: boolean
): IAny
export function map(val: IAny, iterator: IAny, revert?: boolean): IAny {
  type ResType = IAny[] | { [key: string]: IAny };
  const res: ResType = isArr(val) || isStr(val) ? [] : {};
  each(
    val,
    (item, key) => {
      const value = iterator(item, key);
      if (isArr(res)) {
        ; (res as IAny).push(value);
      } else {
        res[key] = value;
      }
    },
    revert,
  );
  return res;
}

export function reduce<T, U>(
  val: T[],
  iterator: MemoArrayIterator<T, U>,
  accumulator?: U,
  revert?: boolean
): U
export function reduce<T>(
  val: string,
  iterator: MemoStringIterator<T>,
  accumulator?: T,
  revert?: boolean
): T
export function reduce<T extends IAnyObject, _TValue = T[keyof T], TResult = IAny>(
  val: T,
  iterator: MemoObjectIterator<_TValue, TResult>,
  accumulator?: TResult,
  revert?: boolean
): TResult
export function reduce(
  val: IAny,
  iterator: IAny,
  accumulator?: IAny,
  revert?: boolean,
): IAny {
  let result = accumulator;
  each(
    val,
    (item, key) => {
      result = iterator(result, item, key);
    },
    revert,
  );
  return result;
}

export function every<T extends string>(
  val: T,
  iterator: EachStringIterator,
  revert?: boolean
): boolean
export function every<T>(
  val: T[],
  iterator: EachArrayIterator<T>,
  revert?: boolean
): boolean
export function every<T extends IAnyObject, _TValue = T[keyof T]>(
  val: T,
  iterator: EachObjectIterator,
  revert?: boolean
): boolean
export function every(val: IAny, iterator: IAny, revert?: boolean): boolean {
  let res = true;
  each(
    val,
    (item, key) => {
      if (!iterator(item, key)) {
        res = false;
        return false;
      }
    },
    revert,
  );
  return res;
}

export function some<T extends string>(
  val: T,
  iterator: EachStringIterator,
  revert?: boolean
): boolean
export function some<T>(
  val: T[],
  iterator: EachArrayIterator<T>,
  revert?: boolean
): boolean
export function some<T extends IAnyObject, _TValue = T[keyof T]>(
  val: T,
  iterator: EachObjectIterator,
  revert?: boolean
): boolean
export function some(val: IAny, iterator: IAny, revert?: boolean): boolean {
  let res = false;
  each(
    val,
    (item, key) => {
      if (iterator(item, key)) {
        res = true;
        return false;
      }
    },
    revert,
  );
  return res;
}

export function findIndex<T extends string>(
  val: T,
  iterator: EachStringIterator,
  revert?: boolean
): number
export function findIndex<T>(
  val: T[],
  iterator: EachArrayIterator<T>,
  revert?: boolean
): number
export function findIndex<T extends IAnyObject, _TValue = T[keyof T]>(
  val: T,
  iterator: EachObjectIterator,
  revert?: boolean
): keyof T
export function findIndex(
  val: IAny,
  iterator: IAny,
  revert?: boolean,
): string | number {
  let res: number | string = -1;
  each(
    val,
    (item, key) => {
      if (iterator(item, key)) {
        res = key;
        return false;
      }
    },
    revert,
  );
  return res;
}

export function find<T extends string>(
  val: T,
  iterator: EachStringIterator,
  revert?: boolean
): IAny
export function find<T>(
  val: T[],
  iterator: EachArrayIterator<T>,
  revert?: boolean
): T
export function find<T extends IAnyObject, _TValue = T[keyof T]>(
  val: T,
  iterator: EachObjectIterator,
  revert?: boolean
): T[keyof T]
export function find(val: IAny, iterator: IAny, revert?: boolean): IAny {
  let res: IAny;
  each(
    val,
    (item, key) => {
      if (iterator(item, key)) {
        res = item;
        return false;
      }
    },
    revert,
  );
  return res;
}

export function includes<T extends string>(
  val: T,
  searchElement: string,
  revert?: boolean
): boolean
export function includes<T>(
  val: T[],
  searchElement: T,
  revert?: boolean
): boolean
export function includes(val: IAny, searchElement: IAny, revert?: boolean) {
  if (isStr(val)) return val.includes(searchElement);
  return some(val, item => item === searchElement, revert);
}

export function includesWith<T extends string>(
  val: T,
  search: (item: string) => boolean
): boolean
export function includesWith<T>(val: T[], search: (item: T) => boolean): boolean
export function includesWith(val: IAny, search: IAny) {
  if (isArr(val)) {
    return val.some(item => search(item));
  }
  return false;
}

export const flat = <T>(array: Array<T | T[]>): T[] => toArr(array).reduce((buf, item) => {
  if (isArr(item)) return buf.concat(flat(item));
  return buf.concat(item);
}, []);
