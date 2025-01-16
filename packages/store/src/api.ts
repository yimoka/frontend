/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAny, IAnyObject, IAPIRequestConfig, IHTTPResponse } from '@yimoka/shared';

/**
 * 执行 Store API
 *
 * @template V - 参数类型，默认为 IAnyObject
 * @template R - 返回值类型，默认为 IAny
 *
 * @param {IStoreAPI<V | undefined, R>} [api] - 可选的 API 配置或函数
 * @param {IAPIExecutor} [apiExecutor] - 可选的 API 执行器函数
 * @param {V} [params] - 可选的参数对象
 * @param {AbortController} [abortController] - 可选的 AbortController 实例，用于取消请求
 *
 * @returns {R | undefined} - 如果提供了 API 函数，则返回其执行结果；如果提供了 API 配置，则返回 API 执行器的结果；否则返回 undefined
 *
 * @example
 * // 示例 1: 使用 API 函数
 * const apiFunction = (params) => { return { success: true, data: params }; };
 * const result = runStoreAPI(apiFunction, undefined, { key: 'value' });
 * console.log(result); // 输出: { success: true, data: { key: 'value' } }
 *
 * @example
 * // 示例 2: 使用 API 配置
 * const apiConfig = { method: 'GET', url: '/api/data', params: { id: 1 } };
 * const apiExecutor = (config) => { return { success: true, config }; };
 * const result = runStoreAPI(apiConfig, apiExecutor, { extraParam: 'value' });
 * console.log(result); // 输出: { success: true, config: { method: 'GET', url: '/api/data', params: { id: 1, extraParam: 'value' } } }
 */
export async function runAPI<V extends object = IAnyObject, R = IAny>(api?: IStoreAPI<V | undefined, R>, apiExecutor?: IAPIExecutor, params?: V, abortController?: AbortController): Promise<IStoreResponse<R, V>> {
  if (!api) {
    return { code: 400, data: '', msg: 'api is required' } as IStoreResponse;
  }
  if (typeof api === 'function') {
    return await api(params) as Promise<IStoreResponse<R, V>>;
  };
  if (!apiExecutor) {
    return { code: 400, data: '', msg: 'apiExecutor is required' } as IStoreResponse;
  }
  const { method } = api;
  const config: IAPIRequestConfig = isMethodPost(method) ? { ...api, data: { ...api.data, ...params } } : { ...api, params: { ...api.params, ...params } };
  if (abortController) {
    config.signal = abortController.signal;
  }
  return apiExecutor(config);
}

const isMethodPost = (method = '') => ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase());

export type IStoreResponse<R = any, V = any> = Partial<IHTTPResponse<R, V | IAnyObject>>;

export type IStoreAPI<V = any, R = any> = IAPIRequestConfig<V> | ((params: V) => Promise<IStoreResponse<R, V>>);

export type IStoreHTTPRequest<R = any, P = any> = (config: IAPIRequestConfig<P>) => Promise<IHTTPResponse<R, P>>;

export type IAPIExecutor = <T extends object = IAPIRequestConfig> (config: T) => Promise<IHTTPResponse>;
