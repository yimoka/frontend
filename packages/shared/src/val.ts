import { isEmpty } from 'lodash-es';
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
