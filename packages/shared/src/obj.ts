import { mergeWith } from 'lodash-es';

import { IAny } from './type';
/**
 * 合并两个对象，当遇到数组时用源数组覆盖目标数组。
 *
 * @param objValue - 目标对象的值
 * @param srcValue - 源对象的值
 * @returns 合并后的对象
 *
 * @example
 * // 示例1：合并两个简单对象
 * const obj1 = { a: 1, b: 2 };
 * const obj2 = { b: 3, c: 4 };
 * const result1 = mergeWithArrayOverride(obj1, obj2);
 * console.log(result1); // 输出: { a: 1, b: 3, c: 4 }
 *
 * @example
 * // 示例2：合并包含数组的对象
 * const obj3 = { a: [1, 2], b: 2 };
 * const obj4 = { a: [3, 4], c: 4 };
 * const result2 = mergeWithArrayOverride(obj3, obj4);
 * console.log(result2); // 输出: { a: [3, 4], b: 2, c: 4 }
 *
 * @example
 * // 示例3：合并嵌套对象
 * const obj5 = { a: { x: 1 }, b: 2 };
 * const obj6 = { a: { y: 2 }, c: 4 };
 * const result3 = mergeWithArrayOverride(obj5, obj6);
 * console.log(result3); // 输出: { a: { x: 1, y: 2 }, b: 2, c: 4 }
 *
 * @example
 * // 示例4：合并包含数组和嵌套对象的复杂对象
 * const obj7 = { a: { x: [1, 2] }, b: 2 };
 * const obj8 = { a: { x: [3, 4], y: 2 }, c: 4 };
 * const result4 = mergeWithArrayOverride(obj7, obj8);
 * console.log(result4); // 输出: { a: { x: [3, 4], y: 2 }, b: 2, c: 4 }
 */
export const mergeWithArrayOverride = (object: IAny, ...otherArgs: IAny[]) => mergeWith(object, ...otherArgs, (objValue: IAny, srcValue: IAny) => {
  if (Array.isArray(objValue)) {
    return srcValue;
  }
  if (typeof objValue === 'object' && typeof srcValue === 'object') {
    return mergeWithArrayOverride(objValue, srcValue);
  }
  return srcValue;
});
