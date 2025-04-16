/**
 * 对象操作工具函数
 * @author zxnum
 * @created 2024-03-21
 * @lastModified 2024-03-21
 * @description 提供对象属性的智能获取和设置功能
 */

import { isEmpty, set, get } from 'lodash-es';
/**
 * 判断值是否为空 ('' | null | undefined | 空对象 | 空数组)
 *
 * @param value - 要检查的值
 * @returns 如果值为 null、undefined 或空字符串/对象/数据，则返回 true；否则返回 false
 *
 * @example
 * ```typescript
 * isVacuous(null); // true
 * isVacuous(undefined); // true
 * isVacuous(''); // true
 * isVacuous('hello'); // false
 * isVacuous(0); // false
 * isVacuous(false); // false
 * ```
 */
export const isVacuous = (value: unknown): value is (null | undefined | '') => {
  const type = typeof value;
  if (['boolean', 'number', 'bigint', 'function'].includes(type)) {
    return false;
  }
  return isEmpty(value);
};

/**
 * 智能设置对象属性值
 * 优先检查属性是否直接存在于对象中，如果存在则直接设置
 * 否则使用 lodash 的 set 方法进行深层设置
 *
 * @param object - 目标对象
 * @param path - 属性路径，可以是字符串、字符串数组或对象的键
 * @param value - 要设置的值
 * @returns 修改后的对象
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: { c: 2 }, 'd.e': '3' };
 *
 * // 直接属性设置
 * setSmart(obj, 'a', 3); // { a: 3, b: { c: 2 }, 'd.e': '3' }
 * setSmart(obj, 'd', 4); // { a: 3, b: { c: 2 }, 'd.e': '3', d: 4 }
 * setSmart(obj, 'd.e', 5); // { a: 3, b: { c: 2 }, 'd.e': 5 }
 *
 * // 深层路径设置
 * setSmart(obj, 'b.c', 4); // { a: 3, b: { c: 4 } }
 * ```
 */
export const setSmart = <T extends object, K extends keyof T>(
  object: T,
  path: K | string | string[],
  value: T[K] | unknown,
): T => {
  if (typeof path === 'string' && path in object) {
    // eslint-disable-next-line no-param-reassign
    object[path as K] = value as T[K];
  } else {
    set(object, path, value);
  }
  return object;
};

/**
 * 智能获取对象属性值
 * 优先检查属性是否直接存在于对象中，如果存在则直接获取
 * 否则使用 lodash 的 get 方法进行深层获取
 *
 * @param object - 目标对象
 * @param path - 属性路径，可以是字符串、字符串数组或对象的键
 * @param defaultValue - 当属性不存在时返回的默认值
 * @returns 获取到的值或默认值
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: { c: 2 }, 'd.e': '3' };
 *
 * // 直接属性获取
 * getSmart(obj, 'a'); // 1
 * getSmart(obj, 'd'); // undefined
 * getSmart(obj, 'd.e'); // '3'
 *
 * // 深层路径获取
 * getSmart(obj, 'b.c'); // 2
 * ```
 */
export const getSmart = <T extends object, K extends keyof T>(
  object: T,
  path: K | string | string[],
  defaultValue?: unknown,
): T[K] | unknown => {
  if (typeof path === 'string' && path in object) {
    return object[path as K];
  }
  return get(object, path, defaultValue);
};

