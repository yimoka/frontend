import { IAny } from './type';
/**
 * 尝试执行一个函数，如果函数抛出错误，则返回默认值或调用错误处理函数。
 *
 * @template T 函数返回值的类型
 * @template U 默认值的类型
 * @param {() => T} fn 要执行的函数
 * @param {U} [defaultValue] 函数抛出错误时返回的默认值
 * @param {(e: Error) => IAny} [handler] 错误处理函数，接收错误对象并返回一个值
 * @returns {T | U | undefined} 函数的返回值，或者默认值，或者错误处理函数的返回值
 *
 * @example
 * // 示例1：函数执行成功
 * const result = autoTry(() => 42, 0);
 * console.log(result); // 输出: 42
 *
 * @example
 * // 示例2：函数抛出错误，返回默认值
 * const result = autoTry(() => { throw new Error('error'); }, 0);
 * console.log(result); // 输出: 0
 *
 * @example
 * // 示例3：函数抛出错误，调用错误处理函数
 * const result = autoTry(() => { throw new Error('error'); }, 0, (e) => `Handled: ${e.message}`);
 * console.log(result); // 输出: "Handled: error"
 */
export function autoTry<T = IAny, U = undefined>(fn: () => T, defaultValue?: U, handler?: (e: Error) => IAny): T | U | undefined {
  try {
    return fn();
  } catch (e: IAny) {
    if (typeof handler === 'function') {
      return handler(e);
    }
    return defaultValue;
  }
}
