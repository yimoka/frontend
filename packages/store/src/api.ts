/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAny, IAnyObject, IAPIRequestConfig, IHTTPResponse } from '@yimoka/shared';

export function runStoreAPI<V extends object = IAnyObject, R = IAny>(api?: IStoreAPI<V | undefined, R>, apiExecutor?: IAPIExecutor, params?: V, abortController?: AbortController) {
  if (!api) {
    return undefined;
  }
  if (typeof api === 'function') {
    return api(params);
  };
  const { method } = api;
  const config: IAPIRequestConfig = isMethodPost(method) ? { ...api, data: { ...api.data, ...params } } : { ...api, params: { ...api.params, ...params } };
  if (abortController) {
    config.signal = abortController.signal;
  }
  return apiExecutor?.(config);
}

export const isMethodPost = (method = '') => ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase());

export type IStoreResponse<R = any, V = any> = Partial<IHTTPResponse<R, V & IAnyObject>>;

export type IStoreAPI<V = any, R = any> = IAPIRequestConfig<V> | ((params: V) => Promise<IStoreResponse<R, V>>);

export type IStoreHTTPRequest<R = any, P = any> = (config: IAPIRequestConfig<P>) => Promise<IHTTPResponse<R, P>>;

export type IAPIExecutor = <T extends object = IAPIRequestConfig> (config: T) => Promise<IHTTPResponse>;
