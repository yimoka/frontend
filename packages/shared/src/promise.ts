import { IAny } from './type';

type IPromiseMap<T = IAny> = Record<string, Promise<T>>;
const promiseMap: IPromiseMap = {};

/**
 * 创建一个单例的 Promise，确保在同一时间内只有一个相同名称的 Promise 在执行。
 *
 * @template T - Promise 的返回类型。
 * @param promise - 一个返回 Promise 的函数。
 * @param name - 用于标识 Promise 的名称。
 * @param map - 可选的 Promise 映射对象，默认使用全局的 promiseMap。
 * @returns 返回一个新的 Promise，该 Promise 会在原始 Promise 解析或拒绝后解析或拒绝。
 *
 * @example
 * ```typescript
 * const fetchData = () => fetch('/api/data').then(response => response.json());
 *
 * promiseSingleton(fetchData, 'fetchData')
 *   .then(data => {
 *     console.log(data); // 输出从 '/api/data' 获取的数据
 *   })
 *   .catch(error => {
 *     console.error(error); // 输出错误信息
 *   });
 * ```
 */
export function promiseSingleton<T>(promise: (...rest: IAny) => Promise<T>, name: string, map?: IPromiseMap<T>) {
  return new Promise<T>((resolve, reject) => {
    const curMap = map ?? promiseMap;
    if (!curMap[name]) {
      curMap[name] = promise();
    }
    curMap[name]?.then?.((res) => {
      delete curMap[name];
      resolve(res);
    })?.catch?.((e) => {
      delete curMap[name];
      reject(e);
    });
  });
}
