import { isBlank } from './val';

/**
 * 将输入值规范化为数组。
 *
 * 如果输入值已经是数组，则按原样返回该值。
 * 如果输入值为空（null、undefined 或空字符串），则返回一个空数组。
 * 否则，返回一个包含输入值的数组。
 *
 * @param value - 要规范化为数组的值
 * @returns 包含输入值的数组，如果输入为空则返回空数组
 * @example
 * ```ts
 * normalizeToArray(1); // [1]
 * normalizeToArray([1, 2]); // [1, 2]
 * normalizeToArray(null); // []
 * normalizeToArray(undefined); // []
 * normalizeToArray(''); // []
 * ```
 */
export const normalizeToArray = <T>(value: T): T extends unknown[] ? T : T[] => {
  if (Array.isArray(value)) {
    return value as T extends unknown[] ? T : T[];
  }
  if (isBlank(value)) {
    return [] as T extends unknown[] ? T : T[];
  }
  return [value] as T extends unknown[] ? T : T[];
};
